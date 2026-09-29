import CandidateDetail from "@/components/CandidateDetail";

export default function CandidateDetailPage({
  params
}: {
  params: { id: string };
}) {
  return <CandidateDetail id={params.id} />;
}
