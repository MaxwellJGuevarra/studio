import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Shield, Users } from "lucide-react";
import type { PiiEntity } from '@/lib/types';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";


interface DashboardViewProps {
  report: any;
  entities: PiiEntity[];
}

const StatCard = ({ title, value, icon, description }: { title: string, value: string | number, icon: React.ReactNode, description: string }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);


export function DashboardView({ report, entities }: DashboardViewProps) {
    const summary = report || { summary: "No summary available.", riskLevel: "unknown", keyFindings: [] };

    const entityCounts = entities.reduce((acc, entity) => {
        acc[entity.type] = (acc[entity.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(entityCounts).map(([name, value]) => ({ name, value }));

    const chartConfig: ChartConfig = {
      value: {
        label: "Count",
        color: "hsl(var(--primary))",
      },
    };

    const riskLevel = summary.riskLevel || 'N/A';

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
               <StatCard title="Overall Risk" value={riskLevel.toUpperCase()} icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />} description="AI-calculated risk level" />
               <StatCard title="PII Found" value={entities.length} icon={<Users className="h-4 w-4 text-muted-foreground" />} description="Total sensitive data points" />
               <StatCard title="Entities Masked" value={entities.length} icon={<Shield className="h-4 w-4 text-muted-foreground" />} description="Will be applied to output file" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-12 lg:col-span-4">
                    <CardHeader>
                        <CardTitle>PII Detections by Type</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <ChartContainer config={chartConfig} className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height={300}>
                           <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                              <CartesianGrid vertical={false} />
                              <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                              <YAxis />
                              <ChartTooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent indicator="dot" />} />
                              <Bar dataKey="value" fill="var(--color-value)" radius={4} />
                           </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                </Card>
                <Card className="col-span-12 lg:col-span-3">
                    <CardHeader>
                        <CardTitle>AI Summary & Key Findings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{summary.summary}</p>
                        <ul className="space-y-2">
                            {summary.keyFindings?.length > 0 ? summary.keyFindings.map((finding: string, index: number) => (
                                <li key={index} className="flex items-start">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 shrink-0" />
                                    <span className="text-sm">{finding}</span>
                                </li>
                            )) : <li className="text-sm text-muted-foreground">No specific findings from AI.</li>}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
