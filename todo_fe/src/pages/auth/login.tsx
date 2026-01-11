import AuthLayout from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/lib/hooks/useLogin";

function LoginPage() {
  const { submit, loading, error } = useLogin();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Đăng nhập</h1>
        <p className="text-sm text-muted-foreground"> Quản lý công việc hiệu quả hơn</p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const formValue = e.currentTarget;
          submit(formValue.email.value, formValue.password.value);
        }}
      >
        <div className="space-y-2">
          <Label>Email</Label>
          <Input name="email" type="email" placeholder="email@example.com" required/>
        </div>

        <div className="space-y-2">
          <Label>Mật khẩu</Label>
          <Input name="password" type="password" required/>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button className="w-full cursor-pointer" disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>

      <div className="text-center text-sm space-y-2">
        <a href="/auth/forgot-password" className="text-secondary hover:underline block">
          Quên mật khẩu?
        </a>
        <a href="/auth/register" className="text-muted-foreground hover:underline block">
          Chưa có tài khoản? Đăng ký
        </a>
      </div>
    </div>
  );
}
LoginPage.getLayout = (page: React.ReactNode) => <AuthLayout>{page}</AuthLayout>;

export default LoginPage;
