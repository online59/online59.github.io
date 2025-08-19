"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

function RealEstateCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(300000);
  const [downPayment, setDownPayment] = useState(60000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTax, setPropertyTax] = useState(300); // monthly
  const [homeInsurance, setHomeInsurance] = useState(100); // monthly

  const { monthlyPayment, totalPayment, loanAmount } = useMemo(() => {
    const loanAmount = purchasePrice - downPayment;
    if (loanAmount <= 0) return { monthlyPayment: 0, totalPayment: 0, loanAmount: 0 };
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    if (monthlyRate === 0) return { monthlyPayment: loanAmount / numberOfPayments, totalPayment: loanAmount, loanAmount };
    
    const numerator = monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments);
    const denominator = Math.pow(1 + monthlyRate, numberOfPayments) - 1;
    const principalAndInterest = loanAmount * (numerator / denominator);
    
    const totalMonthlyPayment = principalAndInterest + propertyTax + homeInsurance;
    
    return { monthlyPayment: totalMonthlyPayment, totalPayment: principalAndInterest, loanAmount };
  }, [purchasePrice, downPayment, interestRate, loanTerm, propertyTax, homeInsurance]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Real Estate Calculator</CardTitle>
        <CardDescription>Estimate your monthly mortgage payments.</CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="purchasePrice">Purchase Price</Label>
            <Input id="purchasePrice" type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="downPayment">Down Payment</Label>
            <Input id="downPayment" type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label>Interest Rate: {interestRate.toFixed(2)}%</Label>
            <Slider value={[interestRate]} onValueChange={(v) => setInterestRate(v[0])} max={15} step={0.01} />
          </div>
          <div className="space-y-2">
            <Label>Loan Term: {loanTerm} years</Label>
            <Slider value={[loanTerm]} onValueChange={(v) => setLoanTerm(v[0])} max={40} step={1} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="propertyTax">Monthly Property Tax</Label>
            <Input id="propertyTax" type="number" value={propertyTax} onChange={(e) => setPropertyTax(Number(e.target.value))} />
          </div>
           <div className="space-y-2">
            <Label htmlFor="homeInsurance">Monthly Home Insurance</Label>
            <Input id="homeInsurance" type="number" value={homeInsurance} onChange={(e) => setHomeInsurance(Number(e.target.value))} />
          </div>
        </div>
        <div className="bg-muted/50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold font-headline">Your Estimated Payment</h3>
          <div className="text-4xl font-bold text-primary">{formatCurrency(monthlyPayment)}/mo</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Loan Amount:</span> <strong>{formatCurrency(loanAmount)}</strong></div>
            <div className="flex justify-between"><span>Principal & Interest:</span> <strong>{formatCurrency(totalPayment)}</strong></div>
            <div className="flex justify-between"><span>Property Tax:</span> <strong>{formatCurrency(propertyTax)}</strong></div>
            <div className="flex justify-between"><span>Home Insurance:</span> <strong>{formatCurrency(homeInsurance)}</strong></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StockValueCalculator() {
  const [eps, setEps] = useState(5);
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
