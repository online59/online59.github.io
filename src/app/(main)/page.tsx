import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Smartphone, CodeXml, BrainCircuit, Github, Linkedin, Mail } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <section className="text-center bg-card p-8 rounded-lg shadow-sm">
        <h1 className="text-5xl font-bold font-headline text-primary">Devfolio Hub</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          A full-stack developer specializing in creating beautiful, functional, and intelligent applications. Explore my skills, tools, and projects.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Github className="size-6" /></a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="size-6" /></a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Mail className="size-6" /></a>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Smartphone className="text-accent" />
              Mobile Development
            </CardTitle>
            <CardDescription>Crafting seamless experiences on iOS and Android.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Expert in native and cross-platform development, delivering high-performance, responsive, and user-friendly mobile applications that engage and delight users.
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <CodeXml className="text-accent" />
              Website Development
            </CardTitle>
            <CardDescription>Building robust and scalable web solutions.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Skilled in modern frontend and backend technologies to create dynamic websites and web applications with a focus on clean code, performance, and security.
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <BrainCircuit className="text-accent" />
              Artificial Intelligence
            </CardTitle>
            <CardDescription>Integrating intelligence into applications.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Leveraging machine learning and AI to build smart features, automate processes, and extract valuable insights from data, creating more powerful and efficient systems.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
