import AuthLayout from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/lib/hooks/useRegister";
import Link from "next/link";

function RegisterPage() {
  const { submit, loading, error } = useRegister();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Đăng ký</h1>
        <p className="text-sm text-muted-foreground"> Tạo tài khoản mới</p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const formValue = e.currentTarget;
          submit(formValue.nameRegister.value, formValue.email.value, formValue.password.value);
        }}
      >
        <div className="space-y-2">
          <Label>Name</Label>
          <Input name="nameRegister" type="text" placeholder="Nguyen Van A" required />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input name="email" type="email" placeholder="email@example.com" required />
        </div>

        <div className="space-y-2">
          <Label>Password</Label>
          <Input name="password" type="password" required />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button className="w-full cursor-pointer" disabled={loading}>
          {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
        </Button>
      </form>

      <div className="text-center text-sm space-y-2">
        <Link href="/auth/login" className="text-muted-foreground hover:underline block">
          Đã có tài khoản? Đăng nhập
        </Link>
      </div>
    </div>
  );
}
RegisterPage.getLayout = (page: React.ReactNode) => <AuthLayout>{page}</AuthLayout>;

export default RegisterPage;
