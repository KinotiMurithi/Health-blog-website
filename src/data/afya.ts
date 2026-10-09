
export type ArticleSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type Article = {
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  excerpt: string;
  readTime: string;
  publishedAt: string;
  introduction: string;
  sections: ArticleSection[];
  featured: boolean;
};

export type Topic = {
  slug: string;
  number: string;
  title: string;
  eyebrow: string;
  description: string;
  introduction: string;
  icon: string;
  accent: string;
  softBackground: string;
  learningPoints: string[];
  articleSlugs: string[];
};

export const topics: Topic[] = [
  {
    slug: "health-education",
    number: "01",
    title: "Health Education",
    eyebrow: "Knowledge for everyday wellbeing",
    description:
      "Understand your health, prevent illness, and make informed everyday choices.",
    introduction:
      "Health education helps you understand your body, recognise health concerns, learn about prevention, and make informed decisions about your wellbeing. Explore accessible information designed to make health topics easier to understand.",
    icon: "✳",
    accent: "#218548",
    softBackground: "#e9f3e9",
    learningPoints: [
      "Understand common health terms and measurements.",
      "Learn about prevention and everyday wellbeing.",
      "Prepare informed questions for healthcare professionals.",
      "Recognise when a concern needs professional assessment.",
    ],
    articleSlugs: ["understanding-your-blood-pressure"],
  },
  {
    slug: "maternal-child-health",
    number: "02",
    title: "Maternal & Child Health",
    eyebrow: "Care through every stage",
    description:
      "Guidance for pregnancy, newborn care, and raising healthier children.",
    introduction:
      "Pregnancy, infancy, and childhood come with important health questions. This section brings together educational information about maternal care, child wellbeing, and recognising signs that may require medical attention.",
    icon: "♡",
    accent: "#8c563b",
    softBackground: "#f8eee6",
    learningPoints: [
      "Understand the purpose of antenatal appointments.",
      "Learn about maternal and child health education.",
      "Recognise warning signs that need prompt assessment.",
      "Find out how preventive care supports family wellbeing.",
    ],
    articleSlugs: [
      "your-guide-to-antenatal-care",
      "understanding-malaria-in-children",
    ],
  },
  {
    slug: "adolescent-health",
    number: "03",
    title: "Adolescent Health",
    eyebrow: "Growing with confidence",
    description:
      "Practical guidance for growing, changing, and navigating adolescence.",
    introduction:
      "Adolescence is a period of physical, emotional, and social development. Reliable health information can help young people and their families better understand these changes, build healthy habits, and know where to seek trusted support.",
    icon: "↗",
    accent: "#495da0",
    softBackground: "#edf0fa",
    learningPoints: [
      "Understand growth, puberty, and changing health needs.",
      "Learn about sleep, nutrition, movement, and wellbeing.",
      "Explore healthy relationships, boundaries, and personal safety.",
      "Know how to seek appropriate professional support.",
    ],
    articleSlugs: [],
  },
  {
    slug: "common-conditions",
    number: "04",
    title: "Common Conditions",
    eyebrow: "Understand symptoms and prevention",
    description:
      "Learn about symptoms, diagnosis, treatment, and prevention.",
    introduction:
      "Understanding common health conditions can help you recognise possible symptoms and make better-informed decisions about seeking care. Educational information can support, but never replace, an individual medical assessment.",
    icon: "+",
    accent: "#8a7028",
    softBackground: "#f5f0df",
    learningPoints: [
      "Learn about symptoms and common health concerns.",
      "Understand why testing and clinical assessment matter.",
      "Explore prevention and general treatment information.",
      "Recognise symptoms that require urgent medical attention.",
    ],
    articleSlugs: [
      "understanding-malaria-in-children",
      "understanding-your-blood-pressure",
    ],
  },
];

export const articles: Article[] = [
  {
    slug: "understanding-malaria-in-children",
    title: "Understanding Malaria in Children",
    category: "Common Conditions",
    categorySlug: "common-conditions",
    excerpt:
      "Learn about malaria symptoms in children, prevention measures, and when to seek medical attention.",
    readTime: "6 min read",
    publishedAt: "October 2026",
    featured: true,
    introduction:
      "Malaria is a serious illness caused by parasites transmitted through the bites of infected female Anopheles mosquitoes. Children can become seriously ill, so recognising symptoms early and seeking appropriate medical care is important.",
    sections: [
      {
        heading: "Common signs and symptoms",
        paragraphs: [
          "Symptoms can include fever, chills, headache, tiredness, vomiting, and reduced appetite. Symptoms may vary, and not every child will experience all of them.",
          "Fever in a child does not automatically mean malaria. Other infections can cause similar symptoms, so appropriate testing and assessment are important.",
        ],
        bullets: [
          "Fever or a history of fever",
          "Unusual tiredness or weakness",
          "Headache or body aches",
          "Vomiting or difficulty feeding",
        ],
      },
      {
        heading: "When to seek urgent medical care",
        paragraphs: [
          "Seek urgent medical attention if a child has difficulty breathing, convulsions, unusual drowsiness, confusion, cannot drink or breastfeed, or becomes unconscious. Do not delay care while waiting for symptoms to improve.",
          "A child with suspected malaria should be assessed promptly by a qualified healthcare professional. Follow the clinician's advice about testing and treatment.",
        ],
      },
      {
        heading: "How to reduce the risk",
        paragraphs: [
          "Preventing mosquito bites is an important part of malaria prevention. Use insecticide-treated mosquito nets as recommended, follow local public-health guidance, and reduce mosquito breeding sites around the home where possible.",
          "If your child develops a fever, seek appropriate assessment rather than relying on home remedies or taking antimalarial medicines without professional guidance.",
        ],
      },
    ],
  },
  {
    slug: "your-guide-to-antenatal-care",
    title: "Your Guide to Antenatal Care",
    category: "Maternal & Child Health",
    categorySlug: "maternal-child-health",
    excerpt:
      "Understand antenatal visits and how routine pregnancy care supports the health of the mother and baby.",
    readTime: "7 min read",
    publishedAt: "October 2026",
    featured: true,
    introduction:
      "Antenatal care is the healthcare provided during pregnancy. Regular visits help healthcare professionals monitor the pregnancy, identify possible complications, provide preventive care, and answer questions about the health of the mother and baby.",
    sections: [
      {
        heading: "When should antenatal care begin?",
        paragraphs: [
          "Arrange an antenatal appointment as soon as you know you are pregnant. Early care helps establish a plan for follow-up visits and allows health concerns to be identified promptly.",
          "The timing and number of visits depend on individual needs and local clinical guidance. Your healthcare provider can recommend a schedule suited to your pregnancy.",
        ],
      },
      {
        heading: "What happens during antenatal visits?",
        paragraphs: [
          "Appointments are an opportunity to discuss your health, medical history, nutrition, medicines, and any symptoms you have noticed. Your provider may check blood pressure, monitor growth, arrange recommended tests, and discuss vaccinations or supplements where appropriate.",
        ],
        bullets: [
          "Review of your health history and current concerns",
          "Blood pressure and other recommended checks",
          "Routine screening and laboratory tests when indicated",
          "Advice on nutrition, medicines, and healthy habits",
          "Planning for birth and follow-up care",
        ],
      },
      {
        heading: "Warning signs during pregnancy",
        paragraphs: [
          "Do not wait for your next scheduled appointment if you experience concerning symptoms. Seek urgent assessment for vaginal bleeding, severe abdominal pain, severe headache with visual changes, difficulty breathing, seizures, or other sudden or severe symptoms.",
          "Reduced fetal movement after you have started feeling regular movements also needs prompt assessment. Follow the guidance given by your maternity-care team.",
        ],
      },
      {
        heading: "Preparing for your appointments",
        paragraphs: [
          "Bring any clinic records, a list of medicines and supplements you take, and questions you would like to discuss. Tell your healthcare provider about symptoms or concerns, even if they seem minor.",
          "Antenatal care is a partnership. Asking questions and attending recommended visits can help you make informed decisions throughout pregnancy.",
        ],
      },
    ],
  },
  {
    slug: "understanding-your-blood-pressure",
    title: "Understanding Your Blood Pressure",
    category: "Health Education",
    categorySlug: "health-education",
    excerpt:
      "Learn what blood pressure readings mean, why monitoring matters, and how everyday habits can support cardiovascular health.",
    readTime: "5 min read",
    publishedAt: "October 2026",
    featured: true,
    introduction:
      "Blood pressure measures the force of blood against the walls of your arteries. Understanding your readings can help you discuss cardiovascular health and possible risks with a healthcare professional.",
    sections: [
      {
        heading: "What do the two numbers mean?",
        paragraphs: [
          "A blood pressure reading has two numbers. Systolic pressure, the top number, measures pressure when the heart contracts. Diastolic pressure, the bottom number, measures pressure between heartbeats.",
          "Blood pressure categories and treatment decisions depend on clinical guidelines, repeated measurements, and individual health factors. A single reading does not always establish a diagnosis.",
        ],
      },
      {
        heading: "Why is monitoring important?",
        paragraphs: [
          "High blood pressure often has no obvious symptoms. When it remains uncontrolled, it can increase the risk of heart disease, stroke, and kidney problems.",
          "Regular checks can help identify elevated readings. A healthcare professional can explain what your results mean and whether further assessment is needed.",
        ],
      },
      {
        heading: "Supporting healthy blood pressure",
        paragraphs: [
          "Everyday habits can contribute to cardiovascular health. The right approach depends on your circumstances, medical history, and any treatment already prescribed.",
        ],
        bullets: [
          "Choose a balanced diet and follow advice on salt intake.",
          "Be physically active in ways appropriate for your health.",
          "Avoid tobacco and limit alcohol where applicable.",
          "Take prescribed medicines as directed.",
          "Attend recommended check-ups and discuss your readings.",
        ],
      },
      {
        heading: "When should you seek medical help?",
        paragraphs: [
          "If you repeatedly receive high readings, arrange a medical assessment even if you feel well. Do not stop or change prescribed blood-pressure medicines without discussing it with your healthcare professional.",
          "A very high reading accompanied by chest pain, difficulty breathing, new weakness, confusion, or changes in vision requires emergency medical assessment.",
        ],
      },
    ],
  },
];

export function getTopicBySlug(slug: string): Topic | undefined {
  return topics.find((topic) => topic.slug === slug);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function getArticlesByTopic(topicSlug: string): Article[] {
  const topic = getTopicBySlug(topicSlug);

  if (!topic) {
    return [];
  }

  return topic.articleSlugs
    .map((articleSlug) => getArticleBySlug(articleSlug))
    .filter((article): article is Article => article !== undefined);
}

export function getFeaturedArticles(): Article[] {
  return articles.filter((article) => article.featured);
}

export function getRelatedArticles(
  currentArticleSlug: string,
  limit = 2
): Article[] {
  const currentArticle = getArticleBySlug(currentArticleSlug);

  if (!currentArticle) {
    return [];
  }

  const sameTopicArticles = articles.filter(
    (article) =>
      article.slug !== currentArticleSlug &&
      article.categorySlug === currentArticle.categorySlug
  );

  const otherArticles = articles.filter(
    (article) =>
      article.slug !== currentArticleSlug &&
      article.categorySlug !== currentArticle.categorySlug
  );

  return [...sameTopicArticles, ...otherArticles].slice(0, limit);
}
