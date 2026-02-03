export const GenerateDocumentModal = () => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Generate Document</h3>

            <select className="input">
                <option>LOR</option>
                <option>Offer Approval</option>
                <option>Completion Certificate</option>
                <option>Custom Report</option>
            </select>

            <select className="input">
                <option>PDF</option>
                <option>DOCX</option>
                <option>XLSX</option>
            </select>

            <button className="btn-primary w-full">
                Generate Document
            </button>
        </div>
    );
};
