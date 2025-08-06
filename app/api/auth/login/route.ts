import { NextResponse } from "next/server";

// Mock user database
const mockUsers = [
  {
    id: "1",
    email: "demo@example.com",
    password: "password123",
    name: "Demo User",
    role: "user",
  },
  {
    id: "2",
    email: "admin@example.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
  },
];

// Mock JWT token generator
function generateMockToken(userId: string): string {
  return `mock-jwt-token-${userId}-${Date.now()}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user in mock database
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate mock token
    const token = generateMockToken(user.id);

    // Return success response
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}