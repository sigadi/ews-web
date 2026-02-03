import QuestionnaireDetail from "@/components/admin/QuestionnaireDetail";

export default async function QuestionnaireDetailPage({
  params,
}: {

  params: Promise<{ id: string }>; 
}) {
  
  const { id } = await params;

  return <QuestionnaireDetail questionnaireId={id} />;
}