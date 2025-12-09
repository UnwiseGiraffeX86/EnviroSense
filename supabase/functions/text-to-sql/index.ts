import { createClient } from 'npm:@supabase/supabase-js@2'
import OpenAI from 'npm:openai'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY') ?? ''

    if (!supabaseUrl || !supabaseAnonKey || !openaiApiKey) {
      throw new Error('Missing environment variables.')
    }

    const authHeader = req.headers.get('Authorization')
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader! } },
    })

    // 1. Verify User is a Doctor
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'doctor') {
      return new Response(JSON.stringify({ error: 'Forbidden: Doctors only' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // 2. Process Query
    const { query } = await req.json()
    const openai = new OpenAI({ apiKey: openaiApiKey })

    // 3. Generate SQL
    const systemPrompt = `
    You are a PostgreSQL expert for a medical database.
    
    Table Schema:
    - profiles (id, full_name, sector, role, respiratory_conditions (text[]), inhaler_usage_frequency (int), focus_index (int))
    - daily_logs (id, user_id, focus_level (int), breathing_status (text), created_at)
    
    Rules:
    1. Return ONLY the raw SQL query. No markdown, no explanations.
    2. Use ILIKE for text matching.
    3. Always limit results to 20 unless specified.
    4. Do not allow DELETE, DROP, or UPDATE queries. SELECT only.
    `

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
      ],
      temperature: 0,
    })

    const sqlQuery = completion.choices[0].message.content?.replace(/```sql|```/g, '').trim()

    if (!sqlQuery || !sqlQuery.toLowerCase().startsWith('select')) {
      throw new Error('Invalid query generated.')
    }

    // 4. Execute SQL (Using RPC for safety if possible, or direct query if enabled)
    // Note: Direct raw SQL execution from client/edge function is risky. 
    // Ideally, we'd use a predefined set of parameterized queries or a very restricted DB role.
    // For this prototype, we will assume the Edge Function has permissions via the Service Role 
    // BUT we are using the Anon Key + Auth Header, so we are bound by RLS.
    // However, RLS might block "Select * from profiles" if not "my profile".
    // Doctors have "Select * from profiles" policy, so this should work!
    
    // We can't run raw SQL via the JS client easily without an RPC.
    // Let's use an RPC function 'exec_sql' (we need to create this migration).
    
    const { data: results, error: dbError } = await supabase.rpc('exec_sql', { query: sqlQuery })

    if (dbError) throw dbError

    return new Response(JSON.stringify({ sql: sqlQuery, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
