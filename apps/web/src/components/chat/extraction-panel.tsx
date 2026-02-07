"use client";

interface Condition {
  name: string;
  probability: number;
}

interface ExtractionPanelProps {
  age?: number;
  symptoms: string[];
  conditions: Condition[];
  status: "gathering" | "extracting" | "searching" | "complete";
}

export default function ExtractionPanel({
  age,
  symptoms,
  conditions,
  status,
}: ExtractionPanelProps) {
  const statusText = {
    gathering: "Gathering information...",
    extracting: "Understanding your symptoms...",
    searching: "Searching clinical trials...",
    complete: "Search complete",
  };

  return (
    <div className="my-4 rounded-lg border border-muted-foreground/20 bg-muted/30 p-4">
      <p className="mb-3 font-semibold text-muted-foreground text-xs uppercase">
        I understood:
      </p>

      <div className="space-y-2 text-sm">
        {age && (
          <p>
            <span className="text-primary">✓</span> Age: {age}
          </p>
        )}

        {symptoms.length > 0 && (
          <p>
            <span className="text-primary">✓</span> Symptoms:{" "}
            {symptoms.join(", ")}
          </p>
        )}

        {conditions.length > 0 && (
          <div>
            <p>
              <span className="text-primary">✓</span> Possible conditions:
            </p>
            <ul className="ml-6 space-y-1">
              {conditions.map((condition) => (
                <li key={condition.name}>
                  {condition.name} ({condition.probability}%)
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="pt-2 text-muted-foreground text-xs italic">
          {statusText[status]}
        </p>
      </div>
    </div>
  );
}
