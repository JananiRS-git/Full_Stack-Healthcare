import { prisma } from "@/lib/prisma";

// Update patient
export async function PUT(req: Request, context: { params: { id: string } | Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const data = await req.json();
    const patientId = parseInt(params.id, 10);

    const updatedPatient = await prisma.patient.update({
      where: { id: patientId },
      data: {
        name: data.name,
        age: data.age,
        bloodGroup: data.bloodGroup,
        weight: data.weight,
        bloodPressure: data.bloodPressure,
        phone: data.phone,
        status: data.status,
        doctorId: data.doctorId,
        doctorName: data.doctorName,
        consultationStatus: data.consultationStatus,
        token: data.token,
        consultationStartedAt: data.consultationStartedAt,
        bookingDate: data.bookingDate,
        bookingTime: data.bookingTime,
      },
    });

    return Response.json({ message: "Patient updated", data: updatedPatient });
  } catch (error) {
    console.error('Error updating patient:', error);
    return Response.json({ error: 'Failed to update patient' }, { status: 500 });
  }
}

// Delete patient
export async function DELETE(req: Request, context: { params: { id: string } | Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const patientId = parseInt(params.id, 10);

    const deletedPatient = await prisma.patient.delete({
      where: { id: patientId },
    });

    return Response.json({ message: "Patient deleted", data: deletedPatient });
  } catch (error) {
    console.error('Error deleting patient:', error);
    return Response.json({ error: 'Failed to delete patient' }, { status: 500 });
  }
}
