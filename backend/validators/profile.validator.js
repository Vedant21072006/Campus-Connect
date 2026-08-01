import { z } from "zod";

export const onboardingSchema = z.object({

    firstName: z.string().trim().min(2).max(30),

    lastName: z.string().trim().min(2).max(30),

    username: z.string().trim().min(3).max(25),

    bio: z.string().max(300).optional(),

    college: z.object({

        collegeName: z.string(),

        department: z.string(),

        branch: z.string(),

        course: z.string(),

        year: z.number(),

        section: z.string()

    }),

    recommendation: z.object({

        interests: z.array(z.string()).min(1).max(5),

        skills: z.array(z.string()).min(1).max(8),

        hobbies: z.array(z.string()).max(5)

    }),

    professional: z.object({

        githubUrl: z.string().optional(),

        linkedinUrl: z.string().optional(),

        portfolioUrl: z.string().optional(),

        resumeUrl: z.string().optional(),

        website: z.string().optional()

    })
});