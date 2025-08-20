import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, CodeXml, BrainCircuit, Github, Linkedin, Mail, GraduationCap, Dumbbell, BookOpen, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  return (
    <div className="space-y-16">
      
      {/* Hero Section */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold font-headline text-primary">Devfolio Hub</h1>
          <p className="text-xl text-muted-foreground">
            From the aviation industry to full-stack development. I build beautiful, functional, and intelligent applications with a unique perspective.
          </p>
          <div className="flex gap-4 pt-4">
            <Button>Get In Touch <Mail className="ml-2" /></Button>
            <Button variant="outline">View Projects</Button>
          </div>
          <div className="flex pt-6 gap-6">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Github className="size-7" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="size-7" /></a>
          </div>
        </div>
        <div className="relative h-80 w-full rounded-lg bg-muted flex items-center justify-center overflow-hidden">
           <Image 
            src="https://placehold.co/600x400.png" 
            alt="Developer portrait"
            layout="fill"
            objectFit="cover"
            data-ai-hint="developer portrait"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"></div>
        </div>
      </section>

      {/* What I do Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold font-headline">What I Do</h2>
          <p className="text-muted-foreground mt-2">I build and optimize digital experiences.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="hover:border-primary/50 hover:shadow-lg transition-all transform hover:-translate-y-1">
            <CardHeader>
              <Smartphone className="size-8 text-primary mb-2" />
              <CardTitle className="font-headline">Mobile Development</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Crafting seamless experiences on iOS and Android, using Swift, SwiftUI, Objective-C, Kotlin, and Java to deliver high-performance, user-friendly mobile applications.
              </p>
            </CardContent>
          </Card>
          <Card className="hover:border-primary/50 hover:shadow-lg transition-all transform hover:-translate-y-1">
            <CardHeader>
              <CodeXml className="size-8 text-primary mb-2" />
              <CardTitle className="font-headline">Website Development</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Skilled in Javascript, Typescript, React, Next.js and Node.js to create dynamic websites with a focus on clean code, performance, and security.
              </p>
            </CardContent>
          </Card>
          <Card className="hover:border-primary/50 hover:shadow-lg transition-all transform hover:-translate-y-1">
            <CardHeader>
              <BrainCircuit className="size-8 text-primary mb-2" />
              <CardTitle className="font-headline">Artificial Intelligence</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Leveraging Genkit, Gemini API and OpenAI API to build smart features, automate processes, and create more powerful, intelligent systems.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

       {/* Technical Skills Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold font-headline">Technical Skills</h2>
          <p className="text-muted-foreground mt-2">My technical toolkit.</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Mobile</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Swift</Badge>
                  <Badge variant="secondary">SwiftUI</Badge>
                  <Badge variant="secondary">Objective-C</Badge>
                  <Badge variant="secondary">Kotlin</Badge>
                  <Badge variant="secondary">Java</Badge>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Web</h4>
                 <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Javascript</Badge>
                  <Badge variant="secondary">Typescript</Badge>
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">Next.js</Badge>
                  <Badge variant="secondary">Node.js</Badge>
                  <Badge variant="secondary">HTML</Badge>
                  <Badge variant="secondary">CSS</Badge>
                </div>
              </div>
               <div>
                <h4 className="font-semibold mb-2">AI</h4>
                 <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Genkit</Badge>
                  <Badge variant="secondary">Gemini API</Badge>
                  <Badge variant="secondary">OpenAI API</Badge>
                </div>
              </div>
               <div>
                <h4 className="font-semibold mb-2">Database</h4>
                 <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Firebase</Badge>
                  <Badge variant="secondary">SwiftData</Badge>
                  <Badge variant="secondary">CoreData</Badge>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Other</h4>
                 <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Git</Badge>
                  <Badge variant="secondary">GitHub</Badge>
                  <Badge variant="secondary">GitLab</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Education Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold font-headline">Education & Training</h2>
          <p className="text-muted-foreground mt-2">My academic and professional foundations.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex-row items-center gap-4">
              <CodeXml className="size-8 text-primary" />
              <div>
                <CardTitle className="font-headline">Full-Stack Development Bootcamp</CardTitle>
                <CardDescription>Tech Academy | 2022</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Completed an intensive program covering modern web technologies including React, Node.js, and cloud services, transitioning my skills from aviation to tech.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center gap-4">
              <GraduationCap className="size-8 text-primary" />
              <div>
                <CardTitle className="font-headline">Bachelor of Business Administration</CardTitle>
                <CardDescription>Civil Aviation Training Center, Bangkok</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Major in Aviation Management. Graduated with a comprehensive understanding of airline and airport management, aviation law, and safety regulations.</p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Hobbies Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold font-headline">Hobbies</h2>
          <p className="text-muted-foreground mt-2">My personal interests and passions.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex-row items-center gap-4">
              <Dumbbell className="size-8 text-primary" />
              <CardTitle className="font-headline">Weight Training</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center gap-4">
              <BookOpen className="size-8 text-primary" />
              <CardTitle className="font-headline">Reading</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center gap-4">
              <Sparkles className="size-8 text-primary" />
              <CardTitle className="font-headline">Meditation</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </section>

       {/* Get in Touch Section */}
      <section className="bg-card border rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold font-headline">Let's build something great.</h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Have a project in mind, a question, or just want to connect? I'm always open to new opportunities and collaborations.
        </p>
        <div className="mt-6">
          <Button size="lg">
            Say Hello <Mail className="ml-2" />
          </Button>
        </div>
      </section>

    </div>
  );
}
