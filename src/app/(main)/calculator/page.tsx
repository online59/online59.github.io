"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from '@/components/ui/scroll-area';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(value);
};

function RealEstateCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(3000000);
  const [downPayment, setDownPayment] = useState(600000);
  const [interestRateYear1, setInterestRateYear1] = useState(1.5);
  const [interestRateYear2, setInterestRateYear2] = useState(2.5);
  const [interestRateYear3, setInterestRateYear3] = useState(3.5);
  const [interestRateDefault, setInterestRateDefault] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTax, setPropertyTax] = useState(0); 
  const [homeInsurance, setHomeInsurance] = useState(0);

  const { monthlyPayment, totalPayment, loanAmount, amortizationSchedule } = useMemo(() => {
    const loanAmount = purchasePrice - downPayment;
    if (loanAmount <= 0) return { monthlyPayment: 0, totalPayment: 0, loanAmount: 0, amortizationSchedule: [] };

    const numberOfPayments = loanTerm * 12;
    let remainingBalance = loanAmount;
    let schedule = [];

    const calculateMonthlyPayment = (principal: number, rate: number, payments: number) => {
        if (rate === 0) return principal / payments;
        const monthlyRate = rate / 100 / 12;
        const numerator = monthlyRate * Math.pow(1 + monthlyRate, payments);
        const denominator = Math.pow(1 + monthlyRate, payments) - 1;
        return principal * (numerator / denominator);
    };
    
    // Use a fixed payment based on default rate for stability, which is common.
    const fixedMonthlyPayment = calculateMonthlyPayment(loanAmount, interestRateDefault, numberOfPayments);

    for (let i = 1; i <= numberOfPayments; i++) {
        let currentAnnualRate;
        if (i <= 12) {
            currentAnnualRate = interestRateYear1;
        } else if (i <= 24) {
            currentAnnualRate = interestRateYear2;
        } else if (i <= 36) {
            currentAnnualRate = interestRateYear3;
        } else {
            currentAnnualRate = interestRateDefault;
        }

        const monthlyInterestRate = currentAnnualRate / 100 / 12;
        const interestComponent = remainingBalance * monthlyInterestRate;
        const principalComponent = fixedMonthlyPayment - interestComponent;
        
        remainingBalance -= principalComponent;

        if (remainingBalance < 0) remainingBalance = 0;

        schedule.push({
            month: i,
            principal: principalComponent,
            interest: interestComponent,
            totalPayment: fixedMonthlyPayment,
            remainingBalance: remainingBalance
        });

        if (remainingBalance === 0) break;
    }

    const firstMonthPayment = schedule.length > 0 ? schedule[0].totalPayment : 0;
    const totalPrincipalAndInterest = schedule.reduce((acc, curr) => acc + curr.totalPayment, 0);

    return { 
        monthlyPayment: firstMonthPayment + propertyTax + homeInsurance, 
        totalPayment: totalPrincipalAndInterest,
        loanAmount,
        amortizationSchedule: schedule
    };
  }, [purchasePrice, downPayment, interestRateYear1, interestRateYear2, interestRateYear3, interestRateDefault, loanTerm, propertyTax, homeInsurance]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Real Estate Calculator</CardTitle>
        <CardDescription>Estimate your monthly mortgage payments with promotional rates.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Purchase Price</Label>
              <Input id="purchasePrice" type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="downPayment">Down Payment</Label>
              <Input id="downPayment" type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="interestRateYear1">Interest Rate Year 1 (%)</Label>
                    <Input id="interestRateYear1" type="number" value={interestRateYear1} onChange={(e) => setInterestRateYear1(Number(e.target.value))} />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="interestRateYear2">Interest Rate Year 2 (%)</Label>
                    <Input id="interestRateYear2" type="number" value={interestRateYear2} onChange={(e) => setInterestRateYear2(Number(e.target.value))} />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="interestRateYear3">Interest Rate Year 3 (%)</Label>
                    <Input id="interestRateYear3" type="number" value={interestRateYear3} onChange={(e) => setInterestRateYear3(Number(e.target.value))} />
                 </div>
            </div>
            <div className="space-y-2">
              <Label>Default Interest Rate: {interestRateDefault.toFixed(2)}%</Label>
              <Slider value={[interestRateDefault]} onValueChange={(v) => setInterestRateDefault(v[0])} max={15} step={0.01} />
            </div>
            <div className="space-y-2">
              <Label>Loan Term: {loanTerm} years</Label>
              <Slider value={[loanTerm]} onValueChange={(v) => setLoanTerm(v[0])} max={40} step={1} />
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold font-headline">Your Estimated Payment</h3>
            <p className="text-sm text-muted-foreground">First month's payment shown below.</p>
            <div className="text-4xl font-bold text-primary">{formatCurrency(monthlyPayment)}/mo</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Loan Amount:</span> <strong>{formatCurrency(loanAmount)}</strong></div>
               <div className="flex justify-between"><span>Principal & Interest (1st mo):</span> <strong>{formatCurrency(amortizationSchedule.length > 0 ? amortizationSchedule[0].totalPayment : 0)}</strong></div>
              <div className="flex justify-between"><span>Property Tax (monthly):</span> <strong>{formatCurrency(propertyTax)}</strong></div>
              <div className="flex justify-between"><span>Home Insurance (monthly):</span> <strong>{formatCurrency(homeInsurance)}</strong></div>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold font-headline mb-4">Amortization Schedule</h3>
          <ScrollArea className="h-96 w-full rounded-md border">
            <Table>
                <TableHeader className="sticky top-0 bg-card">
                    <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Principal</TableHead>
                    <TableHead className="text-right">Interest</TableHead>
                    <TableHead className="text-right">Total Payment</TableHead>
                    <TableHead className="text-right">Remaining Balance</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {amortizationSchedule.map(row => (
                    <TableRow key={row.month}>
                        <TableCell>{row.month}</TableCell>
                        <TableCell className="text-right">{formatCurrency(row.principal)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(row.interest)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(row.totalPayment)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(row.remainingBalance)}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
           </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}

function StockValueCalculator() {
  const [eps, setEps] = useState(150);
  const [growthRate, setGrowthRate] = useState(10);
  const [discountRate, setDiscountRate] = useState(8);
  const terminalGrowthRate = 2.5;

  const intrinsicValue = useMemo(() => {
    try {
      let projectedEps = eps;
      let discountedValue = 0;
      for (let i = 1; i <= 5; i++) {
        projectedEps *= (1 + growthRate / 100);
        discountedValue += projectedEps / Math.pow(1 + discountRate / 100, i);
      }
      
      const terminalValue = (projectedEps * (1 + terminalGrowthRate / 100)) / ((discountRate - terminalGrowthRate) / 100);
      const discountedTerminalValue = terminalValue / Math.pow(1 + discountRate / 100, 5);
      
      const totalValue = discountedValue + discountedTerminalValue;
      return isNaN(totalValue) || !isFinite(totalValue) ? 0 : totalValue;
    } catch {
      return 0;
    }
  }, [eps, growthRate, discountRate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Stock Intrinsic Value</CardTitle>
        <CardDescription>A simplified DCF model to estimate stock value.</CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="eps">Current EPS (Earnings Per Share)</Label>
            <Input id="eps" type="number" value={eps} onChange={e => setEps(Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label>Next 5 Years Growth Rate: {growthRate}%</Label>
            <Slider value={[growthRate]} onValueChange={v => setGrowthRate(v[0])} max={30} step={0.5} />
          </div>
          <div className="space-y-2">
            <Label>Discount Rate: {discountRate}%</Label>
            <Slider value={[discountRate]} onValueChange={v => setDiscountRate(v[0])} max={20} step={0.5} />
          </div>
        </div>
        <div className="bg-muted/50 rounded-lg p-6 flex flex-col justify-center items-center">
            <h3 className="text-lg font-semibold font-headline">Estimated Intrinsic Value</h3>
            <div className="text-5xl font-bold text-primary">{formatCurrency(intrinsicValue)}</div>
            <p className="text-xs text-muted-foreground mt-2">Based on a 5-year projection with a {terminalGrowthRate}% terminal growth rate.</p>
        </div>
      </CardContent>
    </Card>
  );
}


export default function CalculatorPage() {
  return (
    <Tabs defaultValue="real-estate" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="real-estate">Real Estate</TabsTrigger>
        <TabsTrigger value="stock-value">Stock Value</TabsTrigger>
      </TabsList>
      <TabsContent value="real-estate" className="mt-4">
        <RealEstateCalculator />
      </TabsContent>
      <TabsContent value="stock-value" className="mt-4">
        <StockValueCalculator />
      </TabsContent>
    </Tabs>
  );
}
