'use client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PiiEntity } from "@/lib/types";
import { useMemo } from 'react';

interface MaskedDataViewProps {
  originalData: string;
  entities: PiiEntity[];
}

export function MaskedDataView({ originalData, entities }: MaskedDataViewProps) {
  
  const maskedData = useMemo(() => {
    let text = originalData;
    // sort entities by start position descending to not mess up indices
    const sortedEntities = [...entities].sort((a, b) => b.start - a.start);
    
    for (const entity of sortedEntities) {
      const mask = '*'.repeat(entity.text.length);
      text = text.substring(0, entity.start) + mask + text.substring(entity.end);
    }
    return text;
  }, [originalData, entities]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Masked Data Preview</CardTitle>
        <CardDescription>
          This is a preview of the data with all detected PII entities redacted.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
            <div>
                <h3 className="font-semibold mb-2">Original Data</h3>
                <Textarea value={originalData} readOnly rows={15} className="font-mono text-xs"/>
            </div>
            <div>
                <h3 className="font-semibold mb-2">Masked Data</h3>
                <Textarea value={maskedData} readOnly rows={15} className="font-mono text-xs"/>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
