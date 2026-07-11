import { signup } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Sprout } from 'lucide-react'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white mb-4">
            <Sprout className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">AgriSeeds</h1>
        </div>

        <Card className="border-zinc-200 shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">Create an account</CardTitle>
            <CardDescription>
              Enter your details below to create your account.
            </CardDescription>
          </CardHeader>
          <form action={signup}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  name="fullName" 
                  type="text" 
                  placeholder="John Doe" 
                  required 
                  className="focus-visible:ring-green-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="farmer@example.com" 
                  required 
                  className="focus-visible:ring-green-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  className="focus-visible:ring-green-600"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                Sign up
              </Button>
              <div className="text-center text-sm text-zinc-500">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-green-600 hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
