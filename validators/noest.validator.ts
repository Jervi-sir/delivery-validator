export async function validateNoest(
  guid: string,
  token: string,
): Promise<boolean> {
  const createUrl = "https://app.noest-dz.com/api/public/create/order";
  const deleteUrl = "https://app.noest-dz.com/api/public/delete/order";

  try {
    const createRes = await fetch(createUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_guid: guid,
        reference: "validator-test-ref",
        client: "Test Validator",
        phone: "0550505050",
        phone_2: "0660606060",
        adresse: "Oran",
        wilaya_id: 31,
        commune: "Oran",
        montant: 0,
        produit: "Test Product",
        type_id: 1,
        poids: 0.5,
        stop_desk: 0,
        remarque: "Validation check",
      }),
    });

    if (!createRes.ok) return false;

    const createData = await createRes.json();

    if (!createData?.success || !createData?.tracking) {
      return false;
    }

    const tracking = createData.tracking;

    // 1 second cooldown before deleting the created order
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const deleteRes = await fetch(deleteUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_guid: guid,
        tracking: tracking,
      }),
    });

    if (!deleteRes.ok) return false;

    const deleteData = await deleteRes.json();
    return Boolean(deleteData?.success ?? true);
  } catch (error) {
    console.error("Noest validation error:", error);
    return false;
  }
}
