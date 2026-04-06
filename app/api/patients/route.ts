import { prisma } from "@/lib/prisma";

export interface Patient {
  id: number;
  name: string;
  age: number;
  bloodGroup: string;
  weight: number;
  bloodPressure: string;
  phone?: string;
  status: 'Pending' | 'Completed';
  doctorId?: number;
  doctorName?: string;
  consultationStatus?: 'in_progress' | 'verifying_end' | null;
  token?: number | null;
  consultationStartedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  bookingDate?: string;
  bookingTime?: string;
}

export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return Response.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return Response.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const newPatient = await prisma.patient.create({
      data: {
        name: data.name,
        age: data.age,
        bloodGroup: data.bloodGroup,
        weight: data.weight,
        bloodPressure: data.bloodPressure,
        phone: data.phone,
        status: data.status || 'Pending',
        doctorId: data.doctorId,
        doctorName: data.doctorName,
        consultationStatus: data.consultationStatus,
        token: data.token,
        consultationStartedAt: data.consultationStartedAt,
        bookingDate: data.bookingDate,
        bookingTime: data.bookingTime,
      },
    });

    return Response.json({ message: "Patient added", data: newPatient });
  } catch (error) {
    console.error('Error creating patient:', error);
    return Response.json({ error: 'Failed to create patient' }, { status: 500 });
  }
}
