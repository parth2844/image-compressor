export default function FeatureCards() {
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      ),
      title: '100% Private',
      description: 'Files never leave your browser. All processing happens locally on your device.',
      color: 'green',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
      title: 'Lightning Fast',
      description: 'Uses Web Workers for non-blocking compression. Your browser stays responsive.',
      color: 'yellow',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z" />
        </svg>
      ),
      title: 'No Limits',
      description: 'No file size restrictions. No daily quotas. Compress as many images as you need.',
      color: 'purple',
    },
  ];

  const colorClasses = {
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {features.map((feature, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-gray-200 p-5 text-center hover:shadow-md transition-shadow"
        >
          <div className={`w-14 h-14 mx-auto rounded-full ${colorClasses[feature.color]} flex items-center justify-center mb-3`}>
            {feature.icon}
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
          <p className="text-sm text-gray-500">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
