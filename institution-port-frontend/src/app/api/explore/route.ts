import { type NextRequest, NextResponse } from "next/server"

// Mock data for demonstration
const mockInstitutions = [
  {
    id: "1",
    title: "Tribhuvan University",
    subtitle: "Public University",
    description:
      "The oldest and largest university in Nepal, established in 1959. Offers a wide range of undergraduate and graduate programs.",
    image: "/hero2.jpg?height=300&width=400",
    badges: ["Public", "Research", "Established 1959"],
    metadata: {
      location: "Kathmandu, Nepal",
      established: "1959",
      type: "University",
    },
    link: "/"
  },
  {
    id: "2",
    title: "Kathmandu University",
    subtitle: "Private University",
    description: "A leading private university in Nepal known for its quality education and research programs.",
    image: "/hero3.jpg?height=300&width=400",
    badges: ["Private", "Research", "Engineering"],
    metadata: {
      location: "Dhulikhel, Nepal",
      established: "1991",
      type: "University",
    },
    link: "/"
  },
]

const mockCourses = [
  {
    id: "1",
    title: "Bachelor of Computer Engineering",
    subtitle: "Tribhuvan University",
    description:
      "A comprehensive 4-year program covering computer science fundamentals, programming, and engineering principles.",
    badges: ["Engineering", "4 Years", "Bachelor"],
    metadata: {
      duration: "4 years",
      fee: "50000",
      programs: ["Computer Science", "Engineering"],
      deliveryMode: "offline",
    },
    link: "/"
  },
  {
    id: "2",
    title: "Master of Business Administration",
    subtitle: "Kathmandu University",
    description:
      "A 2-year MBA program designed to develop leadership and management skills for business professionals.",
    badges: ["Business", "2 Years", "Master"],
    metadata: {
      duration: "2 years",
      fee: "150000",
      programs: ["Business", "Management"],
      deliveryMode: "online",
    },
    link: "/"
  },
  {
    id: "3",
    title: "Online Data Science Bootcamp",
    subtitle: "Tech Academy",
    description: "An intensive 6-month online program covering machine learning, statistics, and data visualization.",
    badges: ["Online", "6 Months", "Certificate"],
    metadata: {
      duration: "6 months",
      fee: "75000",
      programs: ["Data Science", "Machine Learning"],
      deliveryMode: "online",
    },
    link: "/"
  },
]

const mockForms = [
  {
    id: "1",
    title: "Engineering Entrance Exam 2024",
    subtitle: "IOE Entrance",
    description: "Application form for the Institute of Engineering entrance examination for Bachelor's programs.",
    badges: ["Entrance", "Engineering", "Open"],
    metadata: {
      deadline: "2024-03-15",
      fee: "1500",
      type: "entrance",
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
      type: "entrance",
      deliveryMode: "online",
    },
    link: "/"
  },
  {
    id: "3",
    title: "Scholarship Application Form",
    subtitle: "Merit-based Scholarship",
    description: "Application for merit-based scholarships for undergraduate students in various fields.",
    badges: ["Scholarship", "Merit-based", "Open"],
    metadata: {
      deadline: "2024-04-30",
      fee: "0",
      type: "scholarship",
      deliveryMode: "offline"
    },
    link: "/"
  },
]

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
    case "orm":
      data = mockForms
      break
  }

  // Apply filters
  const search = searchParams.get("search")?.toLowerCase()
  const nation = searchParams.get("nation")?.toLowerCase()
  const type = searchParams.get("type")?.toLowerCase()
  const duration = searchParams.get("duration")?.toLowerCase()
  const deliveryMode = searchParams.get("deliveryMode")?.toLowerCase()
  // const examType = searchParams.get("examType")?.toLowerCase()

  // Search filter
  if (search) {
    const searchLower = search.toLowerCase()
    data = data.filter(
      (item) =>
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.subtitle?.toLowerCase().includes(searchLower),
    )
  }

  // Location filters (disabled for online courses and entrance exams)
  const isLocationDisabled =
    ((mode === "course" || mode === "form") && deliveryMode === "online")

  if (nation && nation !== "nepal" && !isLocationDisabled) {
    data = []
  }

  if (type) {
    data = data.filter(
      (item) =>
        item.metadata.type?.toLowerCase().includes(type.toLowerCase()) ||
        item.badges.some((badge: string) => badge.toLowerCase().includes(type.toLowerCase())),
    )
  }

  if (duration) {
    data = data.filter((item) => item.metadata.duration?.includes(duration))
  }

  if (deliveryMode) {
    data = data.filter((item) => item.metadata.deliveryMode === deliveryMode)
  }



  // Pagination
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedData = data.slice(startIndex, endIndex)
  const totalPages = Math.ceil(data.length / pageSize)

  return NextResponse.json({
    results: paginatedData,
    totalPages,
    currentPage: page,
    total: data.length,
  })
}
