import { useForm, Controller } from "react-hook-form";
import { Input } from "../components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Control } from "react-hook-form";
import { UseFormRegister, FieldErrors } from "react-hook-form";

// Role options for the user
const roles = ["Supervisor", "Student", "Training Representative"];

// Department options
const departments = [
  "Computer Science",
  "Information Technology",
  "Computer Engineering"
];

// Define Form Data Structure
type FormData = {
  userID: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department?: string;
  studiedHours?: number;
  GPA?: number;
  extrainfo: string;
};

function RoleSelector({ control }: { control: Control<FormData> }) {
  return (
    <Controller
      name="role"
      control={control}
      defaultValue=""
      render={({ field }) => (
        <RadioGroup onValueChange={field.onChange} value={field.value}>
          {roles.map((r) => (
            <div key={r} className="flex items-center gap-2">
              <RadioGroupItem value={r} id={r} />
              <label htmlFor={r} className="capitalize">{r}</label>
            </div>
          ))}
        </RadioGroup>
      )}
    />
  );
}

// User Information Fields
function UserInfoFields({ register, errors }: { register: UseFormRegister<FormData>; errors: FieldErrors<FormData> }) {
  return (
    <>
      {/* User ID - Only numbers allowed */}
      <Input
        {...register("userID", { 
          required: "User ID is required", 
          pattern: { value: /^[0-9]+$/, message: "User ID must be numeric" }, 
          maxLength: { value: 8, message: "Max 8 digits allowed" } 
        })}
        placeholder="User ID"
        type="text"
      />
      {errors.userID && <p className="text-red-500 text-sm">{errors.userID.message}</p>}

      <Input {...register("firstName", { required: "First name is required" })} placeholder="First Name" />
      {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}

      <Input {...register("lastName", { required: "Last name is required" })} placeholder="Last Name" />
      {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}

      <Input
        {...register("email", { 
          required: "Email is required", 
          pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" } 
        })}
        type="email"
        placeholder="Email"
      />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
    </>
  );
}

// Conditional Fields based on Role
function ConditionalFields({ register, errors, role }: { register: UseFormRegister<FormData>; errors: FieldErrors<FormData>; role: string }) {
  return (
    <>
      {(role === "Student" || role === "Supervisor") && (
        <>
          <select 
            {...register("department", { required: "Department is required" })} 
            className="w-full p-2 border rounded"
          >
            <option value="">Select Department</option>
            {departments.map((dep) => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
          {errors.department && <p className="text-red-500 text-sm">{errors.department.message}</p>}
        </>
      )}

      {role === "Student" && (
        <>
          <Input
            {...register("studiedHours", { required: "Studied hours required", min: 120 })}
            type="number"
            placeholder="Studied Hours (Min 120)"
          />
          {errors.studiedHours && <p className="text-red-500 text-sm">{errors.studiedHours.message}</p>}

          <Input
            {...register("GPA", { required: "GPA required", min: 0, max: 5 })}
            type="number"
            step="0.01"
            placeholder="GPA (0-5)"
          />
          {errors.GPA && <p className="text-red-500 text-sm">{errors.GPA.message}</p>}
        </>
      )}
    </>
  );
}

export default function RoleBasedForm() {
  const { register, handleSubmit, watch, control, formState: { errors } } = useForm<FormData>();
  const role = watch("role");

  const onSubmit = async (data: FormData) => {
    console.log("Submitting form:", data);

    const formattedData = {
      userID: data.userID,
      name: `${data.firstName} ${data.lastName}`.trim(), // Combine firstName + lastName
      email: data.email,
      role: data.role,
      department: data.department || undefined,
      extrainfo: data.studiedHours && data.GPA ? `${data.studiedHours} hours, GPA: ${data.GPA}` : undefined, // Format extraInfo
    };

    try {
      const response = await axios.post("http://localhost:3000/api/register/", formattedData);
      console.log("Success:", response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error:", error.response ? error.response.data : error.message);
      } else {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="w-screen h-screen bg-[rgb(81,181,214)]">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto p-4 space-y-4 border rounded-lg shadow bg-white">
        <h2 className="text-xl font-semibold">User Registration</h2>
        <RoleSelector control={control} />
        <UserInfoFields register={register} errors={errors} />
        <ConditionalFields register={register} errors={errors} role={role} />
        <Button type="submit" className="w-full">Submit</Button>
      </form>
    </div>
  );
}
