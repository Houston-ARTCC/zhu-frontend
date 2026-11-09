export async function getHomeFacility(
    cid: number,
    division: string,
    existingFacility?: string,
): Promise<string> {
    if (division !== 'USA') {
        return `VAT${division}`;
    }

    const response = await fetch(`https://api.vatusa.net/v2/user/${cid}`);

    if (response.status === 404) {
        return 'VATUSA';
    }

    if (!response.ok) {
        return existingFacility ?? 'VATUSA';
    }

    const body = await response.json();
    return body.data.facility;
}
