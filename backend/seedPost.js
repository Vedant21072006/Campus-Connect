// Mock Data Generator Script
// Document count: 200

const { faker } = require("@faker-js/faker");

// Database and collection configuration - edit these to target a different location
const DB_NAME = "campusConnect";
const COLL_NAME = "posts";

// Connect to database
use(DB_NAME);

// Document generation function
function generateDocument() {
  return {
    _id: new ObjectId(),
    __v: faker.number.int({ min: 0, max: 10 }),
    accountStatus: faker.helpers.arrayElement([
      "active",
      "inactive",
      "pending",
      "suspended"
    ]),
    bio: faker.lorem.paragraph(),
    college: {
      ...(Math.random() < 0.75
        ? { branch: faker.lorem.word() }
        : {}),
      collegeName: faker.company.name(),
      course: faker.helpers.arrayElement([
        "Computer Science",
        "Information Technology",
        "Business Administration",
        "Engineering",
        "Arts",
        "Science"
      ]),
      department: faker.company.catchPhrase(),
      section: faker.helpers.arrayElement([
        "A",
        "B",
        "C",
        "D"
      ]),
      year: faker.number.int({ min: 1, max: 4 })
    },
    coverPicture: {
      publicId: faker.string.alphanumeric({
        length: 16,
        casing: "lower"
      }),
      url: faker.image.url()
    },
    createdAt: faker.date.past(),
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    isOnline: faker.datatype.boolean(),
    isVerified: faker.datatype.boolean(),
    lastLogin: faker.date.recent(),
    lastName: faker.person.lastName(),
    onboardingCompleted: faker.datatype.boolean(),
    passwordHash: faker.string.hexadecimal({
      length: 60,
      prefix: "$2b$10$"
    }),
    professional: {
      githubUrl: faker.internet.url(),
      linkedinUrl: faker.internet.url(),
      portfolioUrl: faker.internet.url(),
      resumeUrl: faker.internet.url(),
      website: faker.internet.url()
    },
    profilePicture: {
      publicId: faker.string.alphanumeric({
        length: 16,
        casing: "lower"
      }),
      url: faker.image.url()
    },
    recommendation: {
      hobbies: Array.from({ length: 5 }, () =>
        faker.helpers.arrayElement([
          "reading",
          "music",
          "sports",
          "gaming",
          "travel",
          "photography",
          "coding",
          "cooking"
        ])
      ),
      interests: Array.from({ length: 5 }, () =>
        faker.helpers.arrayElement([
          "ai",
          "web development",
          "data science",
          "design",
          "robotics",
          "cybersecurity",
          "entrepreneurship"
        ])
      ),
      skills: Array.from({ length: 8 }, () =>
        faker.helpers.arrayElement([
          "communication",
          "teamwork",
          "leadership",
          "problem solving",
          "critical thinking",
          "time management",
          "adaptability",
          "public speaking",
          "research",
          "collaboration"
        ])
      )
    },
    role: faker.lorem.word(),
    stats: {
      communitiesCount: faker.number.int({
        min: 0,
        max: 25
      }),
      followersCount: faker.number.int({
        min: 0,
        max: 10000
      }),
      followingCount: faker.number.int({
        min: 0,
        max: 5000
      }),
      friendsCount: faker.number.int({
        min: 0,
        max: 1000
      }),
      postsCount: faker.number.int({
        min: 0,
        max: 2000
      })
    },
    updatedAt: faker.date.recent(),
    username: faker.internet.username()
  };
}

const BATCH_SIZE = 1000; // Number of documents to insert per batch
const TOTAL_DOCUMENTS = 200;
const numBatches = Math.ceil(
  TOTAL_DOCUMENTS / BATCH_SIZE
);

console.log(
  `Starting mock data generation for ${DB_NAME}.${COLL_NAME}`
);
console.log(
  `Total documents to generate: ${TOTAL_DOCUMENTS} documents`
);
console.log(
  `Batch size: ${BATCH_SIZE} documents per batch`
);

const startTime = new Date();

for (
  let batchStart = 0;
  batchStart < TOTAL_DOCUMENTS;
  batchStart += BATCH_SIZE
) {
  const batchEnd = Math.min(
    batchStart + BATCH_SIZE,
    TOTAL_DOCUMENTS
  );
  const batchSize = batchEnd - batchStart;

  console.log(
    `Generating batch ${
      Math.floor(batchStart / BATCH_SIZE) + 1
    } of ${numBatches} (${batchSize} documents)...`
  );

  // Generate documents for this batch
  const batchDocuments = [];
  for (let i = 0; i < batchSize; i++) {
    batchDocuments.push(generateDocument());
  }

  // Insert the batch
  db.getCollection(COLL_NAME).insertMany(
    batchDocuments
  );

  console.log(`Batch inserted successfully.`);
}

const endTime = new Date();
const duration = (
  (endTime - startTime) /
  1000
).toFixed(2);

console.log(
  `\n=== Mock Data Generation Complete ===`
);
console.log(`Total time: ${duration} seconds`);
console.log(
  `Collection: ${DB_NAME}.${COLL_NAME}`
);

