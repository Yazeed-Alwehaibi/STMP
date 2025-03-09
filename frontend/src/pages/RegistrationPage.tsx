import { useForm, Controller } from "react-hook-form";
import { Input } from "../components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import axios from "axios";

const roles = ["student", "supervisor", "training rep"];

type FormData = {
  role: string;
  userID: string;
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  department?: string;
  studiedHours?: number;
  GPA?: number;
  extraInfo?: string;
};

import { Control, UseFormRegister, FieldErrors } from "react-hook-form";

function RoleSelector({ control }: { control: Control<FormData> }) {
  return (
    <Controller
      name="role"
      control={control}
      defaultValue={roles[1]}
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

function UserInfoFields({ register, errors }: { register: UseFormRegister<FormData>; errors: FieldErrors<FormData> }) {
  return (
    <>
      <Input 
        {...register("userID", { 
          required: true, 
          pattern: { 
            value: /^[0-9]+$/, 
            message: "User ID must contain only numbers" 
          }, 
          maxLength: { value: 8, message: "User ID cannot exceed 8 digits" } 
        })} 
        placeholder="User ID" 
        type="text" 
      />
      {errors.userID && <p className="text-red-500 text-sm">{errors.userID.message}</p>}
      
      <Input {...register("firstName", { required: true, maxLength: 80 })} placeholder="First Name" required />
      {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
      
      <Input {...register("lastName", { required: true, maxLength: 100 })} placeholder="Last Name" required />
      {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
      
      <Input {...register("email", { required: true, pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" } })} type="email" placeholder="Email" required />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
    </>
  );
}

function ConditionalFields({ register, errors, role }: { register: UseFormRegister<FormData>; errors: FieldErrors<FormData>; role: string }) {
  return (
    <>
      {(role === "student" || role === "supervisor") && (
        <>
          <Input {...register("department", { maxLength: 30 })} placeholder="Department" required />
          {errors.department && <p className="text-red-500 text-sm">{errors.department.message}</p>}
        </>
      )}
      {role === "student" && (
        <>
          <Input {...register("studiedHours", { required: true, min: 120, maxLength: 3 })} type="number" placeholder="Studied Hours" required />
          {errors.studiedHours && <p className="text-red-500 text-sm">{errors.studiedHours.message}</p>}
          
          <Input {...register("GPA", { required: true, min: 0, max: 5 })} type="number" step="0.01" placeholder="GPA" required />
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
    const formattedData = {
      ...data,
      name: `${data.firstName} ${data.lastName}`.trim(),
      extraInfo: data.studiedHours && data.GPA ? `${data.studiedHours} hours, GPA: ${data.GPA}` : undefined,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/register", formattedData);
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
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto p-4 space-y-4 border rounded-lg shadow bg-white">
      <h2 className="text-xl font-semibold">User Registration</h2>
      <RoleSelector control={control} />
      <UserInfoFields register={register} errors={errors} />
      <ConditionalFields register={register} errors={errors} role={role} />
      <Button type="submit" className="w-full">Submit</Button>
    </form>
  );
}
