"use client";

import { useState, useMemo } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Save } from "lucide-react";
import { calculateAllocation } from "@/lib/allocation-logic";
import { formatCurrency } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export function SalaryAllocator() {
  const [open, setOpen] = useState(false);
  const [salary, setSalary] = useState<number>(84000);

  const allocations = useMemo(() => calculateAllocation(salary), [salary]);

  const handleSave = () => {
    console.log("Saving budget allocation:", {
      salary,
      allocations,
      date: new Date().toISOString()
    });
    // In the future, this would call a server action to save to DB
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9 border-primary/20 bg-primary/5 hover:bg-primary/10">
          <Sparkles className="h-4 w-4 text-primary" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle>Salary Distributor</DrawerTitle>
          <DrawerDescription>Based on your 2026 Strategy</DrawerDescription>
        </DrawerHeader>
        
        <div className="p-4 space-y-6 overflow-y-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">This Month&apos;s Salary (₹)</label>
            <Input 
              type="number" 
              value={salary} 
              onChange={(e) => setSalary(Number(e.target.value) || 0)}
              className="text-lg font-semibold h-12"
            />
          </div>

          <div className="space-y-3">
            {allocations.map((item) => (
              <Card key={item.ruleId} className="border-l-4 overflow-hidden" style={{ borderLeftColor: `var(--${item.color.replace('bg-', '')})` }}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{item.category}</h4>
                      {item.note && <span className="text-xs text-muted-foreground">{item.note}</span>}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{formatCurrency(item.amount)}</div>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{item.percent}%</span>
                    </div>
                  </div>
                  
                  <Progress 
                    value={item.percent * 2} 
                    className="h-2" 
                    // Note: Shadcn Progress usually uses bg-primary for the indicator. 
                    // To use custom colors, we might need to style the indicator itself or wrap it.
                    // For now, I'll stick to the default Progress which is clean, or try to override class if supported.
                    // The standard indicator className isn't exposed directly via props in standard Shadcn, but we can try generic valid Tailwind.
                  />
                  {/* Fallback visual line if we want exact colors provided in logic */}
                   <div className="relative h-1 w-full bg-secondary rounded-full overflow-hidden mt-1">
                    <div 
                      className={`h-full ${item.color}`} 
                      style={{ width: `${Math.min(item.percent * 2, 100)}%` }} 
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <DrawerFooter>
          <Button onClick={handleSave} className="w-full gap-2">
            <Save className="h-4 w-4" /> Save as this Month&apos;s Budget
          </Button>
          <DrawerClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
