"use client"
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

export default function DoctorBooking() {
  interface Doctor {
    id: string;
    name: string;
    specialities: { name: string }[];
    experience: string;
    fees: string;
    photo: string; // Added photo property
    clinic: {
      name: string;
      address: {
        locality: string;
      };
    };
  }

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialities, setSpecialities] = useState<string[]>([]);
  const [selectedSpecialities, setSelectedSpecialities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    // Fetch data from the API
    fetch("https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json")
      .then((response) => response.json())
      .then((data) => {
        const uniqueSpecialities = Array.from(new Set(data.flatMap((doc: Doctor) => doc.specialities.map((s) => s.name))));
        setSpecialities(uniqueSpecialities as string[]);
        setDoctors(data);
        setIsLoading(false); // Data has been loaded
      })
      .catch((error) => {
        console.error("Error fetching doctors:", error);
        setIsLoading(false); // Stop loading even if there's an error
      });
  }, []);

  const handleSpecialityChange = (speciality: string) => {
    setSelectedSpecialities((prev) =>
      prev.includes(speciality)
        ? prev.filter((s) => s !== speciality)
        : [...prev, speciality]
    );
  };

  const filteredDoctors = selectedSpecialities.length
    ? doctors.filter((doc) =>
        doc.specialities.some((s) => selectedSpecialities.includes(s.name))
      )
    : doctors;

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading state while fetching data
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 p-4 space-y-6 border-r bg-white rounded-r-2xl">
        <div className="bg-gray-200 p-4 rounded-lg">
          <h2 className="font-semibold mb-2" data-testid="filter-header-sort">Sort by</h2>
          <RadioGroup defaultValue="price">
            <label className="flex items-center space-x-2">
              <RadioGroupItem value="price" id="price" className="text-gray-800" data-testid="sort-fees" />
              <span className="text-sm text-gray-800">Price: Low-High</span>
            </label>
            <label className="flex items-center space-x-2">
              <RadioGroupItem value="experience" id="experience" className="text-gray-800" data-testid="sort-experience" />
              <span className="text-sm text-gray-800">Experience: Most Experience first</span>
            </label>
          </RadioGroup>
        </div>

        <div>
          <h2 className="font-semibold mb-2" data-testid="filter-header-speciality">Filters</h2>
          <div className="space-y-4">
            <div className="bg-gray-200 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-1">Specialities</h3>
              <Input placeholder="Search" className="mb-2" data-testid="autocomplete-input" />
              <ScrollArea className="h-32">
                <div className="space-y-2">
                  {specialities.map((speciality) => (
                    <div key={speciality} className="flex items-center space-x-2">
                      <Checkbox
                        id={speciality}
                        checked={selectedSpecialities.includes(speciality)}
                        onChange={() => handleSpecialityChange(speciality)}
                        data-testid={`filter-specialty-${speciality.replace(/\s+/g, "-")}`}
                      />
                      <label htmlFor={speciality} className="text-sm">{speciality}</label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full"
                onClick={() => setSelectedSpecialities([])}
              >
                Clear All Filters
              </Button>
            </div>

            <div className="bg-gray-200 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-1" data-testid="filter-header-moc">Mode of consultation</h3>
              <RadioGroup defaultValue="in-clinic" className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="video" id="video" data-testid="filter-video-consult" />
                  <label htmlFor="video" className="text-sm">Video Consultation</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="in-clinic" id="in-clinic" data-testid="filter-in-clinic" />
                  <label htmlFor="in-clinic" className="text-sm">In-clinic Consultation</label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        {/* Search */}
        <div className="flex items-center gap-4 mb-4">
          <Input placeholder="Search Symptoms, Doctors, Specialists, Clinics" className="flex-1" data-testid="autocomplete-input" />
          <Button variant="outline" size="icon">
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* Doctor Cards */}
        <div className="space-y-4">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doc) => (
              <Card key={doc.id} className=" p-4 text-left" data-testid="doctor-card">
                <div className="flex items-center space-x-4">
                  <img
                    src={doc.photo}
                    alt={`${doc.name}'s photo`}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold" data-testid="doctor-name">{doc.name}</h3>
                    <p className="text-sm text-gray-500" data-testid="doctor-specialty">{doc.specialities.map((s) => s.name).join(", ")}</p>
                    <p className="text-sm" data-testid="doctor-experience">{doc.experience}</p>
                    <p className="text-sm">{doc.clinic.name}</p>
                    <p className="text-sm text-gray-500">{doc.clinic.address.locality}</p>
                  </div>
                </div>
                <div className="text-right mt-4">
                  <p className="font-bold mb-2 pe-4" data-testid="doctor-fee">{doc.fees}</p>
                  <Button variant="outline">Book Appointment</Button>
                </div>
              </Card>
            ))
          ) : (
            <p>No doctors match the selected filters.</p>
          )}
        </div>
      </main>
    </div>
  );
}
