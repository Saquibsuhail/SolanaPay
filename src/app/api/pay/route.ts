import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { encodeURL, findReference, validateTransfer } from "@solana/pay";
import BigNumber from "bignumber.js";
import { NextResponse } from "next/server";

const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com";
const MERCHANT_WALLET = process.env.NEXT_PUBLIC_MERCHANT_WALLET;

if (!MERCHANT_WALLET) {
  throw new Error("Missing NEXT_PUBLIC_MERCHANT_WALLET");
}

const recipient = new PublicKey(MERCHANT_WALLET);
const label = "Solana Coffee House";
const memo = "Coffee purchase";

const paymentRequests = new Map<
  string,
  { recipient: PublicKey; amount: BigNumber; memo: string }
>();

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();
    const bigAmount = new BigNumber(amount);
    const reference = new Keypair().publicKey;
    const message = `Coffee purchase of ${bigAmount.toString()} SOL`;
    
    const url = encodeURL({
      recipient,
      amount: bigAmount,
      reference,
      label,
      message,
      memo
    });

    const ref = reference.toBase58();
    paymentRequests.set(ref, { recipient, amount: bigAmount, memo });
    
    return NextResponse.json({ url: url.toString(), ref });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");
  
  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  try {
    const referencePublicKey = new PublicKey(reference);
    const connection = new Connection(SOLANA_RPC_URL);
    
    let signature;
    try {
      signature = await findReference(connection, referencePublicKey, { finality: 'confirmed' });
    } catch (findError) {
      console.log("Find reference error:", findError);
      return NextResponse.json({ status: "pending" });
    }
    
    const paymentData = paymentRequests.get(reference);
    if (!paymentData) {
      return NextResponse.json({ error: "Payment request not found" }, { status: 404 });
    }

    const { recipient, amount, memo } = paymentData;

    try {
      const valid = await validateTransfer(
        connection,
        signature.signature,
        {
          recipient,
          amount,
          splToken: undefined,
          reference: referencePublicKey,
        },
        { commitment: "confirmed" }
      );

      if (valid) {
        paymentRequests.delete(reference);
        return NextResponse.json({ status: "success" });
      } else {
        return NextResponse.json({ status: "invalid" });
      }
    } catch (validateError) {
      console.log("Validate transfer error:", validateError);
      return NextResponse.json({ status: "invalid" });
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}