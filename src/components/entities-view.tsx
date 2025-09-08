import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { KeyRound, Shield, Zap } from 'lucide-react';

import type { PiiEntity, MaskingRule } from '@/lib/types';

interface EntitiesViewProps {
  entities: PiiEntity[];
  maskingRules: MaskingRule[];
}

const getBadgeVariant = (type: PiiEntity['type']) => {
    switch(type) {
        case 'PERSON':
        case 'ADDRESS':
            return 'destructive';
        case 'EMAIL':
        case 'PHONE_NUMBER':
            return 'secondary';
        default:
            return 'outline';
    }
}

const getRuleForEntity = (entityType: string, rules: MaskingRule[]) => {
    return rules.find(rule => rule.entityType.toUpperCase() === entityType.toUpperCase());
}

export function EntitiesView({ entities, maskingRules }: EntitiesViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detected PII Entities</CardTitle>
        <CardDescription>
          A detailed list of all personal identifiable information found in the document.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Value</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Confidence</TableHead>
                <TableHead>Masking Rule</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {entities.length > 0 ? entities.map((entity, index) => {
                const rule = getRuleForEntity(entity.type, maskingRules);
                return(
                <TableRow key={index}>
                    <TableCell className="font-medium">{entity.text}</TableCell>
                    <TableCell>
                    <Badge variant={getBadgeVariant(entity.type)}>{entity.type}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                    {(entity.score * 100).toFixed(1)}%
                    </TableCell>
                    <TableCell>
                        {rule ? (
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value={`item-${index}`} className="border-b-0">
                                    <AccordionTrigger className="p-0 hover:no-underline font-normal text-sm">
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-4 w-4 text-green-500"/>
                                            <span>{rule.maskingTechnique}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-2 pb-0">
                                        <div className="text-xs text-muted-foreground p-2 bg-muted rounded-md space-y-1">
                                        <p><Zap className="inline h-3 w-3 mr-1"/>{rule.justification}</p>
                                        {rule.parameters && Object.keys(rule.parameters).length > 0 && 
                                        <p><KeyRound className="inline h-3 w-3 mr-1"/>Params: {JSON.stringify(rule.parameters)}</p>
                                        }
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        ) : <span className="text-xs text-muted-foreground">No rule suggested</span>}
                    </TableCell>
                </TableRow>
                )}) : (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            No PII entities found.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
