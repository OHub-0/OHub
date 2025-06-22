
import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { parse } from "cookie"
import { checkUserIsValid } from "@/utils/authtoken"



// Mock data for demonstration
const mockInstitutions = [
  {
    id: "1234",
    title: "Tribhuvan University", //name
    subtitle: "Public University", //owened by
    description:
      "The oldest and largest university in Nepal, established in 1959. Offers a wide range of undergraduate and graduate programs.",
    isFollowing: true,  //is user following
    image: "/hero2.jpg?height=300&width=400", //bg image
    //max five keywords, and max 20 letters per keyword,   keywords=["research", "neurology"...programs...]
    //let insititute oweners choose the keywords,
    badges: ["Public", "Research", "Established 1959",],
    //combining nation and city and established date and type
    metadata: {
      location: "Kathmandu, Nepal",
      established: "1959",
    },
    link: "/" //link
  },
  {
    id: "2",
    title: "Kathmandu University",
    subtitle: "Private University",
    description: "A leading private university in Nepal known for its quality education and research programs.",
    image: "/hero3.jpg?height=300&width=400",
    badges: ["Private", "Research", "Engineering"],
    isFollowing: false,
    metadata: {
      location: "Dhulikhel, Nepal",
      established: "1991",
    },
    link: "/"
  },
]

const mockCourses = [
  {
    id: "1",
    title: "Bachelor of Computer Engineering", //course title
    subtitle: "Tribhuvan University", //owened by
    description:
      "A comprehensive 4-year program covering computer science fundamentals, programming, and engineering principles.",
    //max five keywords, and max 20 letters per keyword,   keywords=["research", "neurology"...programs...]
    //let insititute oweners choose the keywords,
    badges: ["Engineering", "4 Years", "Bachelor"],
    isFollowing: true,
    metadata: {
      duration: "4 years", //duration
      fee: "50000", //fee
      deliveryMode: "offline", //
    },
    link: "/" //link
  },
  {
    id: "2",
    title: "Master of Business Administration",
    subtitle: "Kathmandu University",
    isFollowing: true,
    description:
      "A 2-year MBA program designed to develop leadership and management skills for business professionals.",
    badges: ["Business", "2 Years", "Master"],
    metadata: {
      duration: "2 years",
      fee: "150000",
      deliveryMode: "online",
    },
    link: "/"
  },
  {
    id: "3",
    title: "Online Data Science Bootcamp",
    subtitle: "Tech Academy",
    isFollowing: false,
    description: "An intensive 6-month online program covering machine learning, statistics, and data visualization.",
    badges: ["Online", "6 Months", "Certificate"],
    metadata: {
      duration: "6 months",
      fee: "75000",
      deliveryMode: "online",
    },
    link: "/"
  },
  {
    id: "4",
    title: "Online Data Science Bootcamp",
    subtitle: "Tech Academy",
    isFollowing: false,
    description: "An intensive 6-month online program covering machine learning, statistics, and data visualization.",
    badges: ["Online", "6 Months", "Certificate"],
    metadata: {
      duration: "6 months",
      fee: "75000",
      deliveryMode: "online",
    },
    link: "/"
  },
  {
    id: "5",
    title: "Online Data Science Bootcamp",
    subtitle: "Tech Academy",
    isFollowing: false,
    description: "An intensive 6-month online program covering machine learning, statistics, and data visualization.",
    badges: ["Online", "6 Months", "Certificate"],
    metadata: {
      duration: "6 months",
      fee: "75000",
      deliveryMode: "online",
    },
    link: "/"
  },
  {
    id: "6",
    title: "Online Data Science Bootcamp",
    subtitle: "Tech Academy",
    isFollowing: false,
    description: "An intensive 6-month online program covering machine learning, statistics, and data visualization.",
    badges: ["Online", "6 Months", "Certificate"],
    metadata: {
      duration: "6 months",
      fee: "75000",
      deliveryMode: "online",
    },
    link: "/"
  },
  {
    id: "7",
    title: "Online Data Science Bootcamp",
    subtitle: "Tech Academy",
    isFollowing: false,
    description: "An intensive 6-month online program covering machine learning, statistics, and data visualization.",
    badges: ["Online", "6 Months", "Certificate"],
    metadata: {
      duration: "6 months",
      fee: "75000",
      deliveryMode: "online",
    },
    link: "/"
  },
  {
    id: "8",
    title: "Online Data Science Bootcamp",
    subtitle: "Tech Academy",
    isFollowing: false,
    description: "An intensive 6-month online program covering machine learning, statistics, and data visualization.",
    badges: ["Online", "6 Months", "Certificate"],
    metadata: {
      duration: "6 months",
      fee: "75000",
      deliveryMode: "online",
    },
    link: "/"
  },
  {
    id: "9",
    title: "Online Data Science Bootcamp",
    subtitle: "Tech Academy",
    isFollowing: false,
    description: "An intensive 6-month online program covering machine learning, statistics, and data visualization.",
    badges: ["Online", "6 Months", "Certificate"],
    metadata: {
      duration: "6 months",
      fee: "75000",
      deliveryMode: "online",
    },
    link: "/"
  },
]

const mockForms = [
  {
    id: "1",
    title: "Engineering Entrance Exam 2024", //title
    subtitle: "IOE Entrance", // institue that is taking this
    description: "Application form for the Institute of Engineering entrance examination for Bachelor's programs.",
    //max five keywords, and max 20 letters per keyword,   keywords=["research", "neurology"...programs...]
    //let insititute oweners choose the keywords,
    badges: ["Entrance", "Engineering", "Open"],
    isFollowing: true,
    metadata: {
      //only these need too be send, no need to send form type
      deadline: "2024-03-15",
      fee: "1500",
      deliveryMode: "offline",
    },
    link: "/"
  },
  {
    id: "2",
    title: "Online Medical Entrance Test",
    subtitle: "MBBS Entrance",
    description: "Online entrance examination for medical college admissions across the country.",
    badges: ["Entrance", "Medical", "Online"],
    metadata: {
      deadline: "2024-04-10",
      fee: "2000",
      deliveryMode: "online",
    },
    isFollowing: false,
    link: "/"
  },
  {
    id: "3",
    title: "Scholarship Application Form",
    subtitle: "Merit-based Scholarship",
    description: "Application for merit-based scholarships for undergraduate students in various fields.",
    badges: ["Scholarship", "Merit-based", "Open"],
    isFollowing: false,
    metadata: {
      deadline: "2024-04-30",
      fee: "0",
      deliveryMode: "offline"
    },
    link: "/"
  },
]


// Secret to verify token (must match your login token signing)


export async function GET(request: NextRequest) {

  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get("mode")?.toLowerCase() || "institution"
  const page = Number.parseInt(searchParams.get("page") || "1")
  const pageSize = 6

  let data: any[] = []
  switch (mode) {
    case "institution":
      data = mockInstitutions
      break
    case "course":
      data = mockCourses
      break
    case "form":
      data = mockForms
      break
  }

  // Filtering
  const user = checkUserIsValid(request)
  const search = searchParams.get("search")?.toLowerCase() || undefined
  const type = searchParams.get("type")?.toLowerCase() || undefined
  const duration = searchParams.get("duration")?.toLowerCase() || undefined
  const deliveryMode = searchParams.get("deliveryMode")?.toLowerCase() || undefined
  const nation = searchParams.get("nation")?.toLowerCase() || undefined
  const city = searchParams.get("city")?.toLowerCase() || undefined
  const deadline = searchParams.get("deadline")?.toLowerCase() || undefined
  const programs = searchParams.get("programs")?.split(",").filter(Boolean) || undefined
  const sortBy = searchParams.get("sortBy")?.split(",").filter(Boolean) || undefined
  const isLocationDisabled = ((mode === "course" || mode === "form") && deliveryMode === "online")
  //this is not working make a real filter with above data and db
  if (search) {
    data = data.filter(item =>
      item.title.toLowerCase().includes(search) ||
      item.subtitle?.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search)
    )
  }

  if (nation && nation !== "nepal" && !isLocationDisabled) {
    data = []
  }

  if (type) {
    data = data.filter(item =>
      item.metadata.type?.toLowerCase().includes(type) ||
      item.badges.some((b: string) => b.toLowerCase().includes(type))
    )
  }

  if (duration) {
    data = data.filter(item => item.metadata.duration?.toLowerCase().includes(duration))
  }

  if (deliveryMode) {
    data = data.filter(item => item.metadata.deliveryMode === deliveryMode)
  }

  // Pagination
  const startIndex = (page - 1) * pageSize
  const paginatedData = data.slice(startIndex, startIndex + pageSize)
  const totalPages = Math.ceil(data.length / pageSize)

  // ✅ Conditionally append `isFollowing` if user exists
  const enrichedData = paginatedData.map(item => {
    if (!user) return item

    // 🧠 Example logic: user follows items with even IDs
    const isFollowing = item.id === "1" || item.id === "1234"
    return { ...item, isFollowing }
  })

  return NextResponse.json({
    results: enrichedData,
    currentPage: page,
    totalPages,
    total: data.length,
  })
}
