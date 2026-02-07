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
    <div className="my-4 rounded-2xl border border-orange-100 bg-orange-50/50 p-4 dark:border-orange-950 dark:bg-orange-950/20">
      <p className="mb-3 font-semibold text-orange-700 text-xs uppercase dark:text-orange-300">
        I understood:
      </p>

      <div className="space-y-2 text-sm">
        {age && (
          <p>
            <span className="text-orange-600">✓</span> Age: {age}
          </p>
        )}

        {symptoms.length > 0 && (
          <p>
            <span className="text-orange-600">✓</span> Symptoms:{" "}
            {symptoms.join(", ")}
          </p>
        )}

        {conditions.length > 0 && (
          <div>
            <p>
              <span className="text-orange-600">✓</span> Possible conditions:
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
