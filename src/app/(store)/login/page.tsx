import { login } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Sprout } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
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
            <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
            <CardDescription>
              Enter your email and password to login to your account.
            </CardDescription>
          </CardHeader>
          <form action={login}>
            <CardContent className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm font-medium text-green-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
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
                Sign in
              </Button>
              <div className="text-center text-sm text-zinc-500">
                Don't have an account?{' '}
                <Link href="/signup" className="font-semibold text-green-600 hover:underline">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
