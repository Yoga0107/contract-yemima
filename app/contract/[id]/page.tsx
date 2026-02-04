'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Heart, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

interface Contract {
  id: string;
  title: string;
  status: string;
  created_at: string;
  completed_at: string | null;
}

interface ContractTerm {
  id: string;
  term_text: string;
  term_order: number;
}

interface Signature {
  id: string;
  name: string;
  role: string;
  message: string | null;
  signed_at: string;
}

export default function ContractPage() {
  const params = useParams();
  const router = useRouter();
  const contractId = params.id as string;

  const [contract, setContract] = useState<Contract | null>(null);
  const [terms, setTerms] = useState<ContractTerm[]>([]);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [boyfriendName, setBoyfriendName] = useState('');
  const [boyfriendMessage, setBoyfriendMessage] = useState('');
  const [girlfriendName, setGirlfriendName] = useState('');
  const [girlfriendMessage, setGirlfriendMessage] = useState('');

  const [isSigning, setIsSigning] = useState(false);

  useEffect(() => {
    loadContract();
  }, [contractId]);

  const loadContract = async () => {
    try {
      const { data: contractData, error: contractError } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', contractId)
        .single();

      if (contractError) throw contractError;

      const { data: termsData, error: termsError } = await supabase
        .from('contract_terms')
        .select('*')
        .eq('contract_id', contractId)
        .order('term_order');

      if (termsError) throw termsError;

      const { data: signaturesData, error: signaturesError } = await supabase
        .from('signatures')
        .select('*')
        .eq('contract_id', contractId);

      if (signaturesError) throw signaturesError;

      setContract(contractData);
      setTerms(termsData || []);
      setSignatures(signaturesData || []);
    } catch (error) {
      console.error('Error loading contract:', error);
      alert('Failed to load contract');
    } finally {
      setIsLoading(false);
    }
  };

  const signContract = async (role: 'boyfriend' | 'girlfriend') => {
    const name = role === 'boyfriend' ? boyfriendName : girlfriendName;
    const message = role === 'boyfriend' ? boyfriendMessage : girlfriendMessage;

    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }

    setIsSigning(true);

    try {
      const { error: signError } = await supabase
        .from('signatures')
        .insert({
          contract_id: contractId,
          name: name.trim(),
          role,
          message: message.trim() || null,
        });

      if (signError) throw signError;

      await loadContract();

      const newSignatures = await supabase
        .from('signatures')
        .select('*')
        .eq('contract_id', contractId);

      if (newSignatures.data && newSignatures.data.length === 2) {
        await supabase
          .from('contracts')
          .update({ status: 'completed', completed_at: new Date().toISOString() })
          .eq('id', contractId);

        setTimeout(() => {
          router.push(`/celebrate/${contractId}`);
        }, 1500);
      }

      if (role === 'boyfriend') {
        setBoyfriendName('');
        setBoyfriendMessage('');
      } else {
        setGirlfriendName('');
        setGirlfriendMessage('');
      }
    } catch (error) {
      console.error('Error signing contract:', error);
      alert('Failed to sign contract. Please try again.');
    } finally {
      setIsSigning(false);
    }
  };

  const hasBoyfriendSigned = signatures.some((s) => s.role === 'boyfriend');
  const hasGirlfriendSigned = signatures.some((s) => s.role === 'girlfriend');
  const boyfriendSignature = signatures.find((s) => s.role === 'boyfriend');
  const girlfriendSignature = signatures.find((s) => s.role === 'girlfriend');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-rose-500 fill-rose-500 animate-pulse mx-auto mb-4" />
          <p className="text-rose-700">Loading contract...</p>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-rose-900">Contract not found</p>
            <Button onClick={() => router.push('/')} className="mt-4">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <Heart className="w-16 h-16 text-rose-500 fill-rose-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-rose-900 mb-2">
            {contract.title}
          </h1>
          <p className="text-rose-700">
            Created on {new Date(contract.created_at).toLocaleDateString()}
          </p>
        </div>

        <Card className="border-2 border-rose-200 shadow-xl bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-rose-900 text-center">
              Our Promises
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {terms.map((term, index) => (
                <div
                  key={term.id}
                  className="flex items-start gap-3 p-4 bg-rose-50 rounded-lg border border-rose-200"
                >
                  <span className="text-rose-600 font-semibold mt-1 min-w-[24px]">
                    {index + 1}.
                  </span>
                  <p className="flex-1 text-rose-900">{term.term_text}</p>
                  <Check className="w-5 h-5 text-rose-500 mt-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-rose-300 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-rose-900 flex items-center gap-2">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                Boyfriend's Signature
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasBoyfriendSigned ? (
                <div className="space-y-3">
                  <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
                    <p className="font-semibold text-rose-900 text-lg mb-1">
                      {boyfriendSignature?.name}
                    </p>
                    {boyfriendSignature?.message && (
                      <p className="text-sm text-rose-700 italic">
                        "{boyfriendSignature.message}"
                      </p>
                    )}
                    <p className="text-xs text-rose-600 mt-2">
                      Signed on{' '}
                      {new Date(boyfriendSignature!.signed_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">Signed</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Input
                    placeholder="Your name"
                    value={boyfriendName}
                    onChange={(e) => setBoyfriendName(e.target.value)}
                    className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                  />
                  <Textarea
                    placeholder="Optional: Add a sweet message..."
                    value={boyfriendMessage}
                    onChange={(e) => setBoyfriendMessage(e.target.value)}
                    className="border-rose-200 focus:border-rose-400 focus:ring-rose-400 min-h-[80px]"
                  />
                  <Button
                    onClick={() => signContract('boyfriend')}
                    disabled={isSigning || !boyfriendName.trim()}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white"
                  >
                    {isSigning ? 'Signing...' : 'Sign as Boyfriend'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 border-rose-300 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-rose-900 flex items-center gap-2">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                Girlfriend's Signature
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasGirlfriendSigned ? (
                <div className="space-y-3">
                  <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
                    <p className="font-semibold text-rose-900 text-lg mb-1">
                      {girlfriendSignature?.name}
                    </p>
                    {girlfriendSignature?.message && (
                      <p className="text-sm text-rose-700 italic">
                        "{girlfriendSignature.message}"
                      </p>
                    )}
                    <p className="text-xs text-rose-600 mt-2">
                      Signed on{' '}
                      {new Date(girlfriendSignature!.signed_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">Signed</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Input
                    placeholder="Your name"
                    value={girlfriendName}
                    onChange={(e) => setGirlfriendName(e.target.value)}
                    className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                  />
                  <Textarea
                    placeholder="Optional: Add a sweet message..."
                    value={girlfriendMessage}
                    onChange={(e) => setGirlfriendMessage(e.target.value)}
                    className="border-rose-200 focus:border-rose-400 focus:ring-rose-400 min-h-[80px]"
                  />
                  <Button
                    onClick={() => signContract('girlfriend')}
                    disabled={isSigning || !girlfriendName.trim()}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white"
                  >
                    {isSigning ? 'Signing...' : 'Sign as Girlfriend'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {hasBoyfriendSigned && hasGirlfriendSigned && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 text-green-800 rounded-full border-2 border-green-300">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">
                Contract Complete! Redirecting to celebration...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
