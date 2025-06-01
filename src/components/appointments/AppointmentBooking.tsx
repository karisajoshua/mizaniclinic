
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CalendarDays, Clock, DollarSign, User } from "lucide-react";
import { format, addDays, isSameDay, isAfter, isBefore } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface TimeSlot {
  time: string;
  available: boolean;
}

const AppointmentBooking = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [patientNotes, setPatientNotes] = useState("");
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingStep, setBookingStep] = useState<'date' | 'time' | 'details' | 'payment'>('date');

  useEffect(() => {
    fetchAvailableDates();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchTimeSlots();
    }
  }, [selectedDate]);

  const fetchAvailableDates = async () => {
    try {
      const { data, error } = await supabase
        .from("doctor_availability")
        .select("available_date")
        .eq("doctor_name", "Dr. Mwaka")
        .eq("is_available", true)
        .gte("available_date", format(new Date(), "yyyy-MM-dd"));

      if (error) throw error;

      const dates = data.map(item => new Date(item.available_date));
      setAvailableDates(dates);
    } catch (error) {
      console.error("Error fetching available dates:", error);
      toast({
        title: "Error",
        description: "Failed to load available dates",
        variant: "destructive",
      });
    }
  };

  const fetchTimeSlots = async () => {
    if (!selectedDate) return;

    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      
      // Get availability for the selected date
      const { data: availability, error: availError } = await supabase
        .from("doctor_availability")
        .select("*")
        .eq("available_date", dateStr)
        .eq("doctor_name", "Dr. Mwaka")
        .single();

      if (availError) throw availError;

      // Get existing appointments for this date
      const { data: appointments, error: apptError } = await supabase
        .from("appointments")
        .select("appointment_time")
        .eq("appointment_date", dateStr)
        .eq("doctor_name", "Dr. Mwaka")
        .in("status", ["pending", "confirmed"]);

      if (apptError) throw apptError;

      // Generate time slots
      const slots = generateTimeSlots(
        availability.start_time,
        availability.end_time,
        availability.slot_duration,
        appointments.map(a => a.appointment_time)
      );

      setTimeSlots(slots);
    } catch (error) {
      console.error("Error fetching time slots:", error);
      toast({
        title: "Error",
        description: "Failed to load available time slots",
        variant: "destructive",
      });
    }
  };

  const generateTimeSlots = (startTime: string, endTime: string, duration: number, bookedTimes: string[]) => {
    const slots: TimeSlot[] = [];
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    let currentHour = startHour;
    let currentMinute = startMinute;
    
    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      const isBooked = bookedTimes.includes(timeString + ':00');
      
      slots.push({
        time: timeString,
        available: !isBooked
      });
      
      currentMinute += duration;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
      }
    }
    
    return slots;
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Error",
        description: "Please select date and time",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: sessionData, error } = await supabase.functions.invoke(
        'create-appointment-checkout',
        {
          body: {
            appointmentDate: format(selectedDate, "yyyy-MM-dd"),
            appointmentTime: selectedTime + ":00",
            patientNotes: patientNotes
          }
        }
      );

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(sessionData.url, '_blank');
      
      toast({
        title: "Redirecting to Payment",
        description: "You'll be redirected to complete your payment",
      });
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast({
        title: "Error",
        description: "Failed to create appointment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isDateAvailable = (date: Date) => {
    return availableDates.some(availDate => isSameDay(date, availDate));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5 text-green-600" />
            <span>Book Appointment with Dr. Mwaka</span>
          </CardTitle>
          <CardDescription>
            Select your preferred date and time for consultation ($50)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Date Selection */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <CalendarDays className="w-4 h-4 text-green-600" />
              <Label className="text-base font-medium">Select Date</Label>
            </div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => 
                isBefore(date, new Date()) || 
                isAfter(date, addDays(new Date(), 30)) ||
                !isDateAvailable(date)
              }
              className="rounded-md border"
            />
          </div>

          {/* Step 2: Time Selection */}
          {selectedDate && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-green-600" />
                <Label className="text-base font-medium">Select Time</Label>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    variant={selectedTime === slot.time ? "default" : "outline"}
                    size="sm"
                    disabled={!slot.available}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`${
                      selectedTime === slot.time 
                        ? "bg-green-600 hover:bg-green-700" 
                        : ""
                    } ${!slot.available ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Patient Notes */}
          {selectedDate && selectedTime && (
            <div className="space-y-4">
              <Label className="text-base font-medium">Additional Notes (Optional)</Label>
              <Textarea
                placeholder="Any specific concerns or symptoms you'd like to discuss..."
                value={patientNotes}
                onChange={(e) => setPatientNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          )}

          {/* Step 4: Payment Summary */}
          {selectedDate && selectedTime && (
            <div className="space-y-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Appointment Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Doctor:</span>
                      <span className="font-medium">Dr. Mwaka</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">{format(selectedDate, "EEEE, MMMM do, yyyy")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between border-t border-green-300 pt-2">
                      <span className="font-semibold">Total:</span>
                      <span className="font-bold text-green-800">$50.00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleBookAppointment}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg"
              >
                {loading ? "Processing..." : (
                  <>
                    <DollarSign className="w-5 h-5 mr-2" />
                    Pay & Book Appointment
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentBooking;
