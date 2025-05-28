
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordField from "./PasswordField";

interface FormFieldsProps {
  isLogin: boolean;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onUsernameChange: (value: string) => void;
}

const FormFields = ({
  isLogin,
  email,
  password,
  firstName,
  lastName,
  username,
  onEmailChange,
  onPasswordChange,
  onFirstNameChange,
  onLastNameChange,
  onUsernameChange,
}: FormFieldsProps) => {
  return (
    <>
      {!isLogin && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => onFirstNameChange(e.target.value)}
                required={!isLogin}
                placeholder="John"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => onLastNameChange(e.target.value)}
                required={!isLogin}
                placeholder="Doe"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
              required={!isLogin}
              placeholder="johndoe"
            />
          </div>
        </>
      )}
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          placeholder="john@example.com"
        />
      </div>
      
      <PasswordField
        password={password}
        onChange={onPasswordChange}
      />
    </>
  );
};

export default FormFields;
