import MapCaller from '@/components/MapCaller';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-white text-black">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-8">
        <h1 className="text-4xl font-bold text-green-700">Eco-Neuro Sentinel</h1>
        <div className="flex flex-col items-end">
          <p className="text-gray-600">Real-time Environmental Health Monitoring</p>
          <a href="/patients" className="text-xs text-blue-500 hover:underline mt-1">Debug: View Patients</a>
        </div>
      </div>
      
      <div className="w-full max-w-5xl h-[600px] border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg">
        <MapCaller />
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl">
        <div className="p-6 border rounded-lg shadow-sm bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Air Quality</h2>
          <p className="text-sm text-gray-600">Real-time PM2.5 and PM10 monitoring across Bucharest sectors.</p>
        </div>
        <div className="p-6 border rounded-lg shadow-sm bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Symptom Analysis</h2>
          <p className="text-sm text-gray-600">AI-powered risk assessment based on your symptoms and location.</p>
        </div>
        <div className="p-6 border rounded-lg shadow-sm bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Regulatory Context</h2>
          <p className="text-sm text-gray-600">Automatic retrieval of relevant EU directives and health advisories.</p>
        </div>
      </div>
    </main>
  );
}
