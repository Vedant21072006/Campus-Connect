POST
│
├── _id
│      ObjectId
│
├── author
│      ObjectId → User
│
├── metadata
│      │
│      ├── content
│      │      String
│      │
│      └── media[]
│             │
│             ├── url
│             ├── publicId
│             └── type
│
├── postType
│      general
│      achievement
│      project
│      question
│      event
│      announcement
│
├── visibility
│      public
│      campus
│
├── stats
│      │
│      ├── likes
│      ├── comments
│      ├── shares
│      └── saves
│
├── pinned
│      Boolean
│
├── createdAt
│      Date
│
└── updatedAt
       Date