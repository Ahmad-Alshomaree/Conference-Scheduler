import { DatabaseService } from "./database"

export async function initializeDatabase() {
  try {
    // Create default users
    const defaultUsers = [
      {
        email: "christine.eva@company.com",
        name: "Christine Eva",
        role: "Conference Manager",
        avatar: "CE",
      },
      {
        email: "maren.maureen@company.com",
        name: "Maren Maureen",
        role: "UX Designer",
        avatar: "MM",
      },
      {
        email: "jennifer.jane@company.com",
        name: "Jennifer Jane",
        role: "Developer",
        avatar: "JJ",
      },
      {
        email: "ryan.herwinds@company.com",
        name: "Ryan Herwinds",
        role: "Product Manager",
        avatar: "RH",
      },
      {
        email: "kierra.culhane@company.com",
        name: "Kierra Culhane",
        role: "Data Analyst",
        avatar: "KC",
      },
    ]

    // Check if users already exist
    const existingUsers = await DatabaseService.getAllUsers()

    // create an admin user if not present
    const adminEmail = process.env.ADMIN_EMAIL || "admin@local"
    const adminName = process.env.ADMIN_NAME || "Site Administrator"

    // if there are no users at all, seed defaults + admin
    if (existingUsers.length === 0) {
      console.log("Initializing database with default users...")
      for (const userData of defaultUsers) {
        await DatabaseService.createUser(userData)
      }
      console.log("Default users created successfully!")
    }

    // ensure admin exists (in case there were existing users but no admin)
    const allUsers = await DatabaseService.getAllUsers()
    const hasAdmin = allUsers.some((u) => u.email === adminEmail)
    if (!hasAdmin) {
      console.log(`Creating admin user (${adminEmail})`)
      await DatabaseService.createUser({
        email: adminEmail,
        name: adminName,
        role: "admin",
      })
    }

    return true
  } catch (error) {
    console.error("Error initializing database:", error)
    return false
  }
}
