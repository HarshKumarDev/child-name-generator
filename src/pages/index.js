import { useState } from 'react'

export default function Home () {
  const [gender, setGender] = useState('')
  const [startingLetter, setStartingLetter] = useState('')
  const [regionName, setRegionName] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [generatedNames, setGeneratedNames] = useState(null) // Add state for storing generated names
  const [isLoading, setIsLoading] = useState(false) // Add state for loading state

  const isFormValid = gender && startingLetter && regionName

  const generateName = async () => {
    if (!isFormValid) {
      return
    }
    setIsLoading(true) // Set loading state to true
    const payload = {
      firstLetter: startingLetter,
      gender: gender,
      region: regionName,
      apiKey: apiKey
    }
    try {
      const response = await fetch('/api/nameGenerator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      if (response.ok) {
        const names = await response.json()
        setGeneratedNames(JSON.parse(names))
      } else {
        throw new Error('Failed to generate names')
      }
    } catch (error) {
      console.error('Name generation error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100'>
      <div className='flex flex-col lg:flex-row w-full max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden'>
        <div className='lg:w-1/2 p-8'>
          <h1 className='block mt-1 text-4xl leading-tight font-medium text-black'>
            Child name generator
          </h1>
          <p className='mt-2 text-gray-500'>
            Generate a unique name for your child
          </p>
          <div className='mt-6'>
            <label className='block text-sm font-medium text-gray-700'>
              Gender:
            </label>
            <select
              id='gender'
              className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              value={gender}
              onChange={e => setGender(e.target.value)}
            >
              <option value=''>Select Gender</option>
              <option value='male'>Male</option>
              <option value='female'>Female</option>
            </select>

            <label className='block mt-4 text-sm font-medium text-gray-700'>
              Starting Letter:
            </label>
            <input
              type='text'
              id='startingLetter'
              maxLength='1'
              className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              value={startingLetter}
              onChange={e => setStartingLetter(e.target.value)}
            />
            <label className='block mt-4 text-sm font-medium text-gray-700'>
              Region:
            </label>
            <select
              id='regionName'
              className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              value={regionName}
              onChange={e => setRegionName(e.target.value)}
            >
              <option value=''>Select Region</option>
              <option value='random'>Random</option>
              <option value='indian'>Indian</option>
              <option value='american'>American</option>
              <option value='russian'>Russian</option>
              <option value='german'>German</option>
            </select>
            <label className='block mt-12 text-sm font-medium text-gray-700'>
              OpenAI API Key:
            </label>
            <input
              type='text'
              id='apiKey'
              className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
            />
            <button
              onClick={generateName}
              className={`mt-6 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isFormValid ? '' : 'opacity-50 cursor-not-allowed'
              }`}
              disabled={!isFormValid}
            >
              {isLoading ? (
                <span className='animate-pulse'>Generating...</span>
              ) : (
                'Generate'
              )}
            </button>
          </div>
        </div>
        <div className='lg:w-1/2 p-8 bg-gray-50 text-center'>
          {generatedNames && (
            <div className='h-full flex flex-col justify-center'>
              <h2 className='text-lg text-gray-700'>AI suggested names:</h2>
              <ul className='mt-2 text-gray-500 text-xl font-medium list-disc pl-5'>
                {Object.entries(generatedNames).map(([key, value]) => (
                  <p key={key}>{value}</p>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
