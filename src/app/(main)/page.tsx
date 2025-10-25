import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, CodeXml, BrainCircuit, Github, Linkedin, Mail, GraduationCap, Briefcase, Code, Cpu, Database, BarChart, Dumbbell, BookOpen, Sparkles, Rocket } from "lucide-react";
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
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
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
            fill
            style={{ objectFit: "cover" }}
            data-ai-hint="developer portrait"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"></div>
        </div>
      </section>

      {/* Programming Experience Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold font-headline">Programming Experience</h2>
          <p className="text-muted-foreground mt-2">Highlights of my project work.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <BrainCircuit className="size-8 text-primary mb-2" />
              <CardTitle className="font-headline">ML for Rice Yield Prediction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Researched and developed a deep learning model (MLP, LSTM, CNN) to predict in-season rice yield, achieving a high accuracy (R² of 0.95). The project aims to assist in formulating objective agricultural policies by processing big data with tools like Pandas, Numpy, and Scipy.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Smartphone className="size-8 text-primary mb-2" />
              <CardTitle className="font-headline">Sound Remedy - Flutter App</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Developed and published "Sound Remedy," a mobile application using Flutter that streams natural sounds. The app is designed to help users relax and de-stress, based on research confirming the psychological benefits of natural audio.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Showcase Projects Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold font-headline">Showcase Projects</h2>
          <p className="text-muted-foreground mt-2">A selection of my personal projects.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="flex flex-col">
            <CardHeader>
                <div className="relative h-48 w-full mb-4">
                  <Image src="https://placehold.co/600x400.png" alt="Project 1" fill style={{objectFit: 'cover'}} className="rounded-t-lg" data-ai-hint="data analysis dashboard" />
                </div>
                <CardTitle className="font-headline flex items-center gap-2"><Rocket />AI-Powered Financial Analyst</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground mb-4">
                A web application that uses machine learning to analyze stock market data and provide investment insights. Built with Django, TensorFlow, and React.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Django</Badge>
                <Badge variant="secondary">Python</Badge>
                <Badge variant="secondary">TensorFlow</Badge>
                <Badge variant="secondary">React</Badge>
              </div>
            </CardContent>
            <CardFooter>
                 <Button variant="outline" className="w-full">View on GitHub <Github className="ml-2" /></Button>
            </CardFooter>
          </Card>
           <Card className="flex flex-col">
            <CardHeader>
                <div className="relative h-48 w-full mb-4">
                    <Image src="https://placehold.co/600x400.png" alt="Project 2" fill style={{objectFit: 'cover'}} className="rounded-t-lg" data-ai-hint="mobile app interface" />
                </div>
                <CardTitle className="font-headline flex items-center gap-2"><Smartphone />Task Management App</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground mb-4">
                A cross-platform mobile app for organizing tasks and boosting productivity. Developed with Flutter for a seamless experience on both iOS and Android.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Flutter</Badge>
                <Badge variant="secondary">Firebase</Badge>
                <Badge variant="secondary">Dart</Badge>
              </div>
            </CardContent>
             <CardFooter>
                 <Button variant="outline" className="w-full">View on GitHub <Github className="ml-2" /></Button>
            </CardFooter>
          </Card>
        </div>
      </section>

       {/* Working Experience Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold font-headline">Work Experience</h2>
          <p className="text-muted-foreground mt-2">My professional journey in aviation.</p>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="font-headline flex items-center gap-2"><Briefcase className="size-6 text-primary"/>Airport Operations Planning Manager</CardTitle>
                  <CardDescription>U-Tapao International Aviation</CardDescription>
                </div>
                <div className="text-sm text-muted-foreground text-right">July 2021 – Ongoing</div>
              </div>
            </CardHeader>
            <CardContent>
               <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                 <li>Assessed airport operations and facilities to develop improvement strategies within budget and legal constraints.</li>
                 <li>Coordinated with government units and agencies to facilitate communication and achieve common goals.</li>
                 <li>Conducted site surveys and data collection for new airport development.</li>
                 <li>Developed new business models to increase annual revenue.</li>
               </ul>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="font-headline flex items-center gap-2"><Briefcase className="size-6 text-primary"/>Aviation Security Technical Officer</CardTitle>
                  <CardDescription>Bangkok Airways</CardDescription>
                </div>
                <div className="text-sm text-muted-foreground text-right">April 2018 - June 2021</div>
              </div>
            </CardHeader>
            <CardContent>
               <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                  <li>Monitored changes in national aviation security legislation to update security manuals and procedures.</li>
                  <li>Fostered security information communication and managed incident reporting and investigation.</li>
                  <li>Coordinated with other departments and agencies on security-related matters.</li>
                  <li>Reviewed risk levels and prepared comprehensive risk reports.</li>
                  <li>Conducted aviation security awareness lectures for employees.</li>
               </ul>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="font-headline flex items-center gap-2"><Briefcase className="size-6 text-primary"/>Safety Officer</CardTitle>
                  <CardDescription>Newgen Airways</CardDescription>
                </div>
                <div className="text-sm text-muted-foreground text-right">October 2016 - January 2018</div>
              </div>
            </CardHeader>
            <CardContent>
               <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                <li>Identified and eliminated safety hazards to prevent accidents and incidents.</li>
                <li>Investigated aircraft accidents/incidents and formulated recommendations.</li>
                <li>Promoted safety publications and awareness throughout the organization.</li>
                <li>Performed station safety audits under the guidance of a lead auditor.</li>
               </ul>
            </CardContent>
          </Card>
        </div>
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
              <GraduationCap className="size-8 text-primary" />
              <div>
                <CardTitle className="font-headline">Master of Science in Computer Science</CardTitle>
                <CardDescription>Kasetsart University, Bangkok | 2022 - Present</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Currently pursuing a Master's degree with a focus on advanced computer science topics, building on my passion for technology. GPA: 3.86</p>
            </CardContent>
          </Card>
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
                <CardTitle className="font-headline">Bachelor of Science in Aviation Management</CardTitle>
                <CardDescription>Civil Aviation Training Center, Bangkok | 2012 - 2015</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Specialized in Airport Management, graduating with a comprehensive understanding of airline and airport operations, aviation law, and safety regulations.</p>
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

      {/* Technical Skills Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold font-headline">Technical Skills</h2>
          <p className="text-muted-foreground mt-2">My technical toolkit.</p>
        </div>
        <Card>
          <CardContent className="p-6 grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2"><Smartphone className="text-primary" />Frontend</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Flutter</Badge>
              </div>
            </div>
             <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2"><CodeXml className="text-primary" />Web Development</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Django</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2"><Database className="text-primary" />Database</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">SQL</Badge>
              </div>
            </div>
             <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2"><Code className="text-primary" />Programming Languages</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Java</Badge>
                <Badge variant="secondary">Python</Badge>
                <Badge variant="secondary">C</Badge>
              </div>
            </div>
             <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2"><Cpu className="text-primary" />Machine Learning</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Scikit-Learn</Badge>
                <Badge variant="secondary">TensorFlow</Badge>
                <Badge variant="secondary">Keras</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2"><BarChart className="text-primary" />Data Science</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Numpy</Badge>
                <Badge variant="secondary">Pandas</Badge>
                <Badge variant="secondary">Seaborn</Badge>
                <Badge variant="secondary">Matplotlib</Badge>
                <Badge variant="secondary">Scipy</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
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
