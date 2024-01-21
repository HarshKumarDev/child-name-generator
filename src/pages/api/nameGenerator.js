import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env['OPENAI_KEY']
})

export default async function handler (req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { firstLetter, gender, region, apiKey } = req.body

  if (!firstLetter || !gender || !region) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You help generate names for children based on the first letter of their name, gender and region.'
        },
        {
          role: 'user',
          content: `Generate five potential child names when their region is ${region}, their gender is ${gender} and their name starts with ${firstLetter}.`
        },
        {
          role: 'user',
          content: `STRICTLY MAKE THE RESPONSE IS AN OBJECT WHERE THE KEYS ARE "name1", "name2", "name3", "name4" and "name5" and the values are the names generated by the API, RETURN NOTHING ELSE.`
        }
      ]
    })
    const names = response.choices[0].message.content
    return res.status(200).json(names)
  } catch (error) {
    console.error('Name generation error:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
