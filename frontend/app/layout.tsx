import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EcoResearch AI - Sustainability Policy Analysis Workspace',
  description: 'AI-powered workspace for Sustainability Analysts and Policy Advisors. High-capacity document ingestion, Q&A, and LangGraph report generation with universal citations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-[#ededed] min-h-screen selection:bg-violet-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
