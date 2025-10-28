import { LoginForm } from "@/components/login-form";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-medium text-xl">
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="size-10"
            />
            HepiBite
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/">home</Link>
            </Button>
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/login.jpg"
          alt="Image"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}
