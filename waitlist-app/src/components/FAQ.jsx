const QUESTIONS = [
  ["Who is KAWS Academy for?", "Our programs are designed for students, early-career professionals and practitioners moving into financial crime, compliance and risk. The curriculum includes beginner, intermediate and advanced modules."],
  ["What will I be able to learn?", "Explore 12 domains, including AML, customer due diligence and KYC, transaction monitoring, sanctions, regulatory frameworks, fraud risk and career development. Each domain includes focused modules with its own level and duration."],
  ["Are the courses available yet?", "The academy’s programs are coming soon. Join the waitlist to receive launch updates and information about available programs. Course details and timing will be shared as they become available."],
  ["Does joining the waitlist cost anything?", "No. Joining the waitlist is free and does not enroll you in a paid course. You can explore the curriculum before deciding which program is right for you."],
  ["What happens after I join?", "We’ll save your interest and email address so we can keep you informed about the academy’s launch. You can optionally choose a learning domain to tell us what you’re interested in."],
];

export default function FAQ() {
  return <section className="k-section academy-faq" id="faq"><div className="k-container academy-faq-grid"><div><span className="k-eyebrow">A little more clarity</span><h2 className="k-display">Before you<br /><em>take the next step.</em></h2><p>Have another question?<br /><a href="mailto:kawsacademy@gmail.com">Get in touch with our team ↗</a></p></div><div className="academy-faq-list">{QUESTIONS.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></section>;
}