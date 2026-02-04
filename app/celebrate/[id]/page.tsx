'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Heart, Sparkles, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

interface Contract {
  id: string;
  title: string;
  completed_at: string;
}

interface Signature {
  name: string;
  role: string;
  message: string | null;
  signed_at: string;
}

interface ContractTerm {
  term_text: string;
  term_order: number;
}

export default function CelebratePage() {
  const params = useParams();
  const router = useRouter();
  const contractId = params.id as string;

  const [contract, setContract] = useState<Contract | null>(null);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [terms, setTerms] = useState<ContractTerm[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContractData();
  }, [contractId]);

  const loadContractData = async () => {
    try {
      const { data: contractData, error: contractError } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', contractId)
        .single();

      if (contractError) throw contractError;

      const { data: signaturesData, error: signaturesError } = await supabase
        .from('signatures')
        .select('*')
        .eq('contract_id', contractId);

      if (signaturesError) throw signaturesError;

      const { data: termsData, error: termsError } = await supabase
        .from('contract_terms')
        .select('*')
        .eq('contract_id', contractId)
        .order('term_order');

      if (termsError) throw termsError;

      setContract(contractData);
      setSignatures(signaturesData || []);
      setTerms(termsData || []);
    } catch (error) {
      console.error('Error loading contract:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const boyfriendSignature = signatures.find((s) => s.role === 'boyfriend');
  const girlfriendSignature = signatures.find((s) => s.role === 'girlfriend');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 flex items-center justify-center">
        <Heart className="w-16 h-16 text-rose-500 fill-rose-500 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12 space-y-4">
          <div className="flex justify-center gap-4 mb-6">
            <Sparkles className="w-12 h-12 text-rose-400 animate-pulse" />
            <Heart className="w-16 h-16 text-rose-500 fill-rose-500 animate-bounce" />
            <Sparkles className="w-12 h-12 text-rose-400 animate-pulse" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-rose-900 leading-tight">
            Congratulations!
          </h1>

          <p className="text-2xl text-rose-700">
            You're officially boyfriend and girlfriend!
          </p>

          {contract?.completed_at && (
            <p className="text-rose-600">
              Since {new Date(contract.completed_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          )}
        </div>

        <Card className="border-2 border-rose-200 shadow-2xl bg-white/90 backdrop-blur-sm mb-8">
          <CardHeader className="border-b-2 border-rose-100">
            <CardTitle className="text-3xl text-rose-900 text-center font-serif">
              {contract?.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-rose-900 text-center mb-4">
                Our Promises
              </h3>
              {terms.map((term, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-rose-50 rounded-lg border border-rose-200"
                >
                  <span className="text-rose-600 font-semibold mt-1">
                    {index + 1}.
                  </span>
                  <p className="flex-1 text-rose-900">{term.term_text}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-6 border-t-2 border-rose-100">
              {boyfriendSignature && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-rose-700">Boyfriend</p>
                  <div className="p-4 bg-rose-50 rounded-lg border-2 border-rose-200">
                    <p className="font-serif text-2xl text-rose-900 mb-2">
                      {boyfriendSignature.name}
                    </p>
                    {boyfriendSignature.message && (
                      <p className="text-sm text-rose-700 italic">
                        "{boyfriendSignature.message}"
                      </p>
                    )}
                    <p className="text-xs text-rose-600 mt-3">
                      {new Date(boyfriendSignature.signed_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {girlfriendSignature && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-rose-700">Girlfriend</p>
                  <div className="p-4 bg-rose-50 rounded-lg border-2 border-rose-200">
                    <p className="font-serif text-2xl text-rose-900 mb-2">
                      {girlfriendSignature.name}
                    </p>
                    {girlfriendSignature.message && (
                      <p className="text-sm text-rose-700 italic">
                        "{girlfriendSignature.message}"
                      </p>
                    )}
                    <p className="text-xs text-rose-600 mt-3">
                      {new Date(girlfriendSignature.signed_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <div className="inline-block p-6 bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-rose-200">
            <p className="text-lg text-rose-800 mb-4">
              Share this special moment with your loved one
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => router.push('/')}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                <Heart className="mr-2 w-4 h-4 fill-white" />
                Back to Home
              </Button>
              <Button
                onClick={() => window.print()}
                variant="outline"
                className="border-rose-300 text-rose-700 hover:bg-rose-50"
              >
                <Download className="mr-2 w-4 h-4" />
                Save as PDF
              </Button>
            </div>
          </div>

          <p className="text-rose-600 text-sm max-w-md mx-auto">
            Keep this contract as a beautiful reminder of the day you officially
            became a couple. Here's to many happy memories together!
          </p>
        </div>
      </div>
    </div>
  );
}
