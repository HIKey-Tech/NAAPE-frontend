import PublicationDetail from "@/components/member/component/publication.detail";


export default function BrowsePublicationDetailsPage() {

    return (
        <div className="min-h-[500px] w-full flex items-center justify-center py-6 px-2">
            <PublicationDetail hideStatus={true} />
        </div>
    );
}
