'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Plus, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

const defaultTerms = [
  'We promise to communicate openly and honestly with each other',
  'We will respect each other\'s boundaries and personal space',
  'We commit to supporting each other\'s dreams and goals',
  'We agree to be faithful and loyal to one another',
  'We will make time for each other despite our busy schedules',
];

export default function CreateContract() {
  const router = useRouter();
  const [title, setTitle] = useState('Our Relationship Contract');
  const [terms, setTerms] = useState<string[]>(defaultTerms);
  const [newTerm, setNewTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addTerm = () => {
    if (newTerm.trim()) {
      setTerms([...terms, newTerm.trim()]);
      setNewTerm('');
    }
  };

  const removeTerm = (index: number) => {
    setTerms(terms.filter((_, i) => i !== index));
  };

  const createContract = async () => {
    if (terms.length === 0) {
      alert('Please add at least one term to your contract');
      return;
    }

    setIsLoading(true);

    try {
      const { data: contract, error: contractError } = await supabase
        .from('contracts')
        .insert({ title, status: 'pending' })
        .select()
        .single();

      if (contractError) throw contractError;

      const termsToInsert = terms.map((term, index) => ({
        contract_id: contract.id,
        term_text: term,
        term_order: index,
      }));

      const { error: termsError } = await supabase
        .from('contract_terms')
        .insert(termsToInsert);

      if (termsError) throw termsError;

      router.push(`/contract/${contract.id}`);
    } catch (error) {
      console.error('Error creating contract:', error);
      alert('Failed to create contract. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Heart className="w-16 h-16 text-rose-500 fill-rose-500" />
          </div>
          <h1 className="text-4xl font-bold text-rose-900 mb-2">
            Create Your Relationship Contract
          </h1>
          <p className="text-rose-700">
            Make your commitment official with meaningful promises
          </p>
        </div>

        <Card className="border-2 border-rose-200 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-rose-900">
              Contract Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-rose-900">
                Contract Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                placeholder="Our Relationship Contract"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-rose-900">
                  Our Agreements
                </label>
                <span className="text-sm text-rose-600">
                  {terms.length} {terms.length === 1 ? 'term' : 'terms'}
                </span>
              </div>

              <div className="space-y-3">
                {terms.map((term, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-rose-50 rounded-lg border border-rose-200 group hover:bg-rose-100 transition-colors"
                  >
                    <span className="text-rose-600 font-semibold mt-1 min-w-[24px]">
                      {index + 1}.
                    </span>
                    <p className="flex-1 text-rose-900">{term}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeTerm(index)}
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-200 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Textarea
                  value={newTerm}
                  onChange={(e) => setNewTerm(e.target.value)}
                  placeholder="Add a new promise or agreement..."
                  className="border-rose-200 focus:border-rose-400 focus:ring-rose-400 min-h-[80px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      addTerm();
                    }
                  }}
                />
                <Button
                  onClick={addTerm}
                  variant="outline"
                  className="w-full border-rose-300 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Term
                </Button>
              </div>
            </div>

            <div className="pt-6 flex gap-4">
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                className="flex-1 border-rose-300 text-rose-700 hover:bg-rose-50"
              >
                Cancel
              </Button>
              <Button
                onClick={createContract}
                disabled={isLoading || terms.length === 0}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white"
              >
                {isLoading ? (
                  'Creating...'
                ) : (
                  <>
                    Create Contract
                    <Sparkles className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
