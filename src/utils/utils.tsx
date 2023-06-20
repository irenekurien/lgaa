export const formatResponse = (res: string) => {
    const regex = /Section\s+(\d+)/g;
    const sections = res.split(regex);

    return (
        <div>
            {sections.map((section, index) => {
                if (section.match(regex)) {
                    return (
                        <strong key={index}>Section {section}</strong>
                    );
                } else {
                    return (
                        <span key={index}>{section}</span>
                    );
                }
            })}
        </div>
    );
}