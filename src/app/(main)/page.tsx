import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, CodeXml, BrainCircuit, Github, Linkedin, Mail, ExternalLink, Briefcase, GraduationCap } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="space-y-16">
      
      {/* Hero Section */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold font-headline text-primary">Devfolio Hub</h1>
          <p className="text-xl text-muted-foreground">
            A full-stack developer specializing in creating beautiful, functional, and intelligent applications. Explore my skills, tools, and projects.
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

      {/* Skills Section */}
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
                Crafting seamless experiences on iOS and Android, delivering high-performance, responsive, and user-friendly mobile applications.
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
                Skilled in modern frontend and backend tech to create dynamic websites with a focus on clean code, performance, and security.
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
                Leveraging AI to build smart features, automate processes, and extract valuable insights, creating more powerful systems.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="space-y-8">
         <div className="text-center">
          <h2 className="text-3xl font-bold font-headline">Featured Projects</h2>
          <p className="text-muted-foreground mt-2">A selection of my best work.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="flex flex-col group">
            <div className="relative h-56 w-full overflow-hidden rounded-t-lg">
              <Image src="https://placehold.co/600x400.png" alt="Project 1" layout="fill" objectFit="cover" data-ai-hint="abstract tech" />
            </div>
            <CardHeader>
              <CardTitle>Project Alpha</CardTitle>
              <CardDescription>A sophisticated data visualization tool for enterprise clients.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-secondary text-secondary-foreground py-1 px-2 rounded-full">React</span>
                <span className="bg-secondary text-secondary-foreground py-1 px-2 rounded-full">Node.js</span>
                <span className="bg-secondary text-secondary-foreground py-1 px-2 rounded-full">D3.js</span>
              </div>
            </CardContent>
            <div className="p-6 pt-0">
               <Button variant="outline" className="w-full">View Project <ExternalLink className="ml-2" /></Button>
            </div>
          </Card>
           <Card className="flex flex-col group">
            <div className="relative h-56 w-full overflow-hidden rounded-t-lg">
              <Image src="https://placehold.co/600x400.png" alt="Project 2" layout="fill" objectFit="cover" data-ai-hint="mobile app" />
            </div>
            <CardHeader>
              <CardTitle>Mobile Companion App</CardTitle>
              <CardDescription>A cross-platform app to manage IoT devices on the go.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
               <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-secondary text-secondary-foreground py-1 px-2 rounded-full">Flutter</span>
                <span className="bg-secondary text-secondary-foreground py-1 px-2 rounded-full">Firebase</span>
                <span className="bg-secondary text-secondary-foreground py-1 px-2 rounded-full">Genkit</span>
              </div>
            </CardContent>
            <div className="p-6 pt-0">
               <Button variant="outline" className="w-full">View Project <ExternalLink className="ml-2" /></Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Work Experience Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold font-headline">Work Experience</h2>
          <p className="text-muted-foreground mt-2">My professional journey.</p>
        </div>
        <div className="relative pl-6 after:absolute after:inset-y-0 after:w-px after:bg-border after:left-0">
          <div className="space-y-12">
            <div className="relative">
              <div className="absolute top-0 -left-6 size-5 bg-primary rounded-full border-4 border-background"></div>
              <h3 className="text-xl font-semibold font-headline">Senior Frontend Developer</h3>
              <p className="text-sm text-muted-foreground">Innovate Corp | 2020 - Present</p>
              <p className="mt-2 text-sm">Led the development of a new component library in React, improving code reusability by 40%. Collaborated with UX/UI designers to implement pixel-perfect designs for a major product overhaul.</p>
            </div>
            <div className="relative">
              <div className="absolute top-0 -left-6 size-5 bg-primary rounded-full border-4 border-background"></div>
              <h3 className="text-xl font-semibold font-headline">Full-Stack Developer</h3>
              <p className="text-sm text-muted-foreground">Tech Solutions Ltd. | 2018 - 2020</p>
              <p className="mt-2 text-sm">Developed and maintained both client-side and server-side applications for a suite of SaaS products. Optimized database queries which resulted in a 25% reduction in page load times.</p>
            </div>
            <div className="relative">
              <div className="absolute top-0 -left-6 size-5 bg-primary rounded-full border-4 border-background"></div>
              <h3 className="text-xl font-semibold font-headline">Junior Web Developer</h3>
              <p className="text-sm text-muted-foreground">Startup Inc. | 2017 - 2018</p>
              <p className="mt-2 text-sm">Assisted in building and launching the company's first marketing website using HTML, CSS, and JavaScript. Gained foundational experience in a fast-paced agile environment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold font-headline">Education</h2>
          <p className="text-muted-foreground mt-2">My academic background.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex-row items-center gap-4">
              <GraduationCap className="size-8 text-primary" />
              <div>
                <CardTitle className="font-headline">Master of Science in AI</CardTitle>
                <CardDescription>University of Advanced Tech | 2017</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Specialized in machine learning and natural language processing. Thesis project involved creating a sentiment analysis model for social media data.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center gap-4">
              <GraduationCap className="size-8 text-primary" />
              <div>
                <CardTitle className="font-headline">Bachelor of Science in Computer Science</CardTitle>
                <CardDescription>State University | 2015</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Graduated with honors. Focused on software engineering principles, data structures, and algorithms. President of the coding club.</p>
            </CardContent>
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
