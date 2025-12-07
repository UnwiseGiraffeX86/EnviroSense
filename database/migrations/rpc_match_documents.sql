-- ==============================================================================
-- RPC Function: match_documents
-- ==============================================================================
-- Description: Performs a vector similarity search using cosine distance.
-- This function is critical for the RAG pipeline to retrieve relevant context.

-- 1. Drop the function if it exists (to allow return type changes)
DROP FUNCTION IF EXISTS match_documents(vector, double precision, integer);

-- 2. Create the function
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    knowledge_base.id,
    knowledge_base.content,
    knowledge_base.metadata,
    1 - (knowledge_base.embedding <=> query_embedding) AS similarity
  FROM knowledge_base
  WHERE 1 - (knowledge_base.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
