import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const completion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: generatePrompt(req.body.salary_expectations),
    temperature: 0,
    temperature: 0,
    max_tokens: 200,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  res.status(200).json({ result: completion.data.choices[0].text });
}

function generatePrompt(salary_expectations) {
    return `Fill in the information about the candidate's First Name, Last Name, Job Title, Current Company, Email, Phone, LinkedIn Profile, City, State, Country, Desired Job Position, Desired Base Salary, Desired Commission Bonus, and Desired Equity:
    ${salary_expectations}
    {
   "user_type": "Candidate",`
}
