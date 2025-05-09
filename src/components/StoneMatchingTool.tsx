
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowRight, Search } from "lucide-react";
import { mockDiamonds } from "@/data/mockDiamonds";
import { Diamond, DiamondShape } from "@/types/diamond";
import { formatCurrency, getStatusClass, getCutClass, getColorClass, getClarityClass } from "@/lib/utils";

interface MatchingCriteria {
  shape: DiamondShape | 'any';
  caratTolerance: number;
  colorMatch: 'exact' | 'similar' | 'any';
  clarityMatch: 'exact' | 'similar' | 'any';
  cutMatch: 'exact' | 'similar' | 'any';
  minPairs: number;
}

interface DiamondSet {
  id: string;
  diamonds: Diamond[];
  matchScore: number;
  totalCarats: number;
  averagePrice: number;
}

const StoneMatchingTool: React.FC = () => {
  const [criteria, setCriteria] = useState<MatchingCriteria>({
    shape: 'any',
    caratTolerance: 5, // 5% tolerance by default
    colorMatch: 'similar',
    clarityMatch: 'similar',
    cutMatch: 'similar',
    minPairs: 2
  });
  
  const [matchingSets, setMatchingSets] = useState<DiamondSet[]>([]);
  const [selectedSet, setSelectedSet] = useState<DiamondSet | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [noMatchesFound, setNoMatchesFound] = useState(false);

  const clarityRanking: Record<string, number> = {
    'FL': 10, 'IF': 9, 'VVS1': 8, 'VVS2': 7, 'VS1': 6, 'VS2': 5, 'SI1': 4, 'SI2': 3, 'I1': 2, 'I2': 1, 'I3': 0
  };
  
  const colorRanking: Record<string, number> = {
    'D': 10, 'E': 9, 'F': 8, 'G': 7, 'H': 6, 'I': 5, 'J': 4, 'K': 3, 'L': 2, 'M': 1, 'Z+': 0
  };

  const cutRanking: Record<string, number> = {
    'Excellent': 4, 'Very Good': 3, 'Good': 2, 'Fair': 1, 'Poor': 0
  };

  const isSimilarColor = (color1: string, color2: string): boolean => {
    const ranking1 = colorRanking[color1];
    const ranking2 = colorRanking[color2];
    return Math.abs(ranking1 - ranking2) <= 1;
  };

  const isSimilarClarity = (clarity1: string, clarity2: string): boolean => {
    const ranking1 = clarityRanking[clarity1];
    const ranking2 = clarityRanking[clarity2];
    return Math.abs(ranking1 - ranking2) <= 1;
  };

  const isSimilarCut = (cut1: string, cut2: string): boolean => {
    const ranking1 = cutRanking[cut1];
    const ranking2 = cutRanking[cut2];
    return Math.abs(ranking1 - ranking2) <= 1;
  };

  const calculateMatchScore = (diamonds: Diamond[]): number => {
    if (diamonds.length < 2) return 0;
    
    let totalScore = 100;
    const firstDiamond = diamonds[0];
    
    // Calculate variations in important attributes
    for (let i = 1; i < diamonds.length; i++) {
      const currentDiamond = diamonds[i];
      
      // Carat difference (percentage)
      const caratDiff = Math.abs(firstDiamond.carat - currentDiamond.carat) / firstDiamond.carat * 100;
      totalScore -= caratDiff * 2; // Deduct 2 points for each percent difference
      
      // Color difference
      if (firstDiamond.color !== currentDiamond.color) {
        totalScore -= isSimilarColor(firstDiamond.color, currentDiamond.color) ? 5 : 15;
      }
      
      // Clarity difference
      if (firstDiamond.clarity !== currentDiamond.clarity) {
        totalScore -= isSimilarClarity(firstDiamond.clarity, currentDiamond.clarity) ? 5 : 15;
      }
      
      // Cut difference
      if (firstDiamond.cut !== currentDiamond.cut) {
        totalScore -= isSimilarCut(firstDiamond.cut, currentDiamond.cut) ? 5 : 15;
      }
    }
    
    return Math.max(0, Math.min(100, totalScore));
  };

  const findMatchingSets = () => {
    setIsSearching(true);
    setNoMatchesFound(false);
    setMatchingSets([]);
    setSelectedSet(null);
    
    // Filter available diamonds first
    const availableDiamonds = mockDiamonds.filter(diamond => 
      diamond.status === 'Available' && 
      (criteria.shape === 'any' || diamond.shape === criteria.shape)
    );
    
    console.log(`Found ${availableDiamonds.length} available diamonds matching shape ${criteria.shape}`);
    
    // Group by shape
    const diamondsByShape: Record<string, Diamond[]> = {};
    
    availableDiamonds.forEach(diamond => {
      const shape = diamond.shape;
      if (!diamondsByShape[shape]) {
        diamondsByShape[shape] = [];
      }
      diamondsByShape[shape].push(diamond);
    });
    
    const sets: DiamondSet[] = [];
    
    // For each shape group, find matching sets
    Object.entries(diamondsByShape).forEach(([shape, diamonds]) => {
      console.log(`Processing ${diamonds.length} diamonds of shape ${shape}`);
      // Skip if not enough diamonds for a set
      if (diamonds.length < criteria.minPairs) {
        console.log(`Not enough diamonds of shape ${shape} (${diamonds.length}) for a set of ${criteria.minPairs}`);
        return;
      }
      
      // Sort by carat size to make matching easier
      diamonds.sort((a, b) => a.carat - b.carat);
      
      // For each diamond, try to find matches
      for (let i = 0; i < diamonds.length; i++) {
        const baseDiamond = diamonds[i];
        const potentialMatches: Diamond[] = [baseDiamond];
        
        // Look for matching diamonds
        for (let j = 0; j < diamonds.length; j++) {
          if (i === j) continue; // Skip comparing with itself
          
          const candidateDiamond = diamonds[j];
          
          // Check carat tolerance
          const caratDiff = Math.abs(baseDiamond.carat - candidateDiamond.carat) / baseDiamond.carat * 100;
          if (caratDiff > criteria.caratTolerance) continue;
          
          // Check color
          if (criteria.colorMatch === 'exact' && baseDiamond.color !== candidateDiamond.color) continue;
          if (criteria.colorMatch === 'similar' && !isSimilarColor(baseDiamond.color, candidateDiamond.color)) continue;
          
          // Check clarity
          if (criteria.clarityMatch === 'exact' && baseDiamond.clarity !== candidateDiamond.clarity) continue;
          if (criteria.clarityMatch === 'similar' && !isSimilarClarity(baseDiamond.clarity, candidateDiamond.clarity)) continue;
          
          // Check cut
          if (criteria.cutMatch === 'exact' && baseDiamond.cut !== candidateDiamond.cut) continue;
          if (criteria.cutMatch === 'similar' && !isSimilarCut(baseDiamond.cut, candidateDiamond.cut)) continue;
          
          // Diamond is a match, add to potential matches
          potentialMatches.push(candidateDiamond);
        }
        
        // Create a set if we found enough matches
        if (potentialMatches.length >= criteria.minPairs) {
          const totalCarats = potentialMatches.reduce((sum, d) => sum + d.carat, 0);
          const averagePrice = potentialMatches.reduce((sum, d) => sum + d.retailPrice, 0) / potentialMatches.length;
          const matchScore = calculateMatchScore(potentialMatches);
          
          sets.push({
            id: `set-${sets.length + 1}`,
            diamonds: potentialMatches,
            matchScore,
            totalCarats,
            averagePrice
          });
          
          console.log(`Found matching set with ${potentialMatches.length} diamonds, score: ${matchScore}`);
          
          // Skip diamonds we've already used in this set to avoid duplicate sets
          i += potentialMatches.length - 1;
        }
      }
    });
    
    // Sort sets by match score (highest first)
    sets.sort((a, b) => b.matchScore - a.matchScore);
    
    console.log(`Found ${sets.length} matching sets in total`);
    
    setMatchingSets(sets);
    setIsSearching(false);
    if (sets.length > 0) {
      setSelectedSet(sets[0]);
    } else {
      setNoMatchesFound(true);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stone Matching Tool</CardTitle>
          <CardDescription>
            Find matching pairs or sets of diamonds based on size and grade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Shape</label>
              <Select
                value={criteria.shape}
                onValueChange={(value: any) => setCriteria({...criteria, shape: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any shape" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Shape</SelectItem>
                  <SelectItem value="Round">Round</SelectItem>
                  <SelectItem value="Princess">Princess</SelectItem>
                  <SelectItem value="Cushion">Cushion</SelectItem>
                  <SelectItem value="Emerald">Emerald</SelectItem>
                  <SelectItem value="Oval">Oval</SelectItem>
                  <SelectItem value="Radiant">Radiant</SelectItem>
                  <SelectItem value="Asscher">Asscher</SelectItem>
                  <SelectItem value="Marquise">Marquise</SelectItem>
                  <SelectItem value="Pear">Pear</SelectItem>
                  <SelectItem value="Heart">Heart</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Carat Tolerance (%)</label>
              <div className="flex items-center space-x-2">
                <Slider
                  value={[criteria.caratTolerance]}
                  min={0}
                  max={20}
                  step={1}
                  onValueChange={(values) => setCriteria({...criteria, caratTolerance: values[0]})}
                  className="flex-1"
                />
                <span className="w-12 text-center">{criteria.caratTolerance}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Minimum stones in set</label>
              <Select
                value={criteria.minPairs.toString()}
                onValueChange={(value) => setCriteria({...criteria, minPairs: parseInt(value)})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Minimum stones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 (Pair)</SelectItem>
                  <SelectItem value="3">3 (Trio)</SelectItem>
                  <SelectItem value="4">4 or more</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Color Match</label>
              <Select
                value={criteria.colorMatch}
                onValueChange={(value: any) => setCriteria({...criteria, colorMatch: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Color matching" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exact">Exact Match</SelectItem>
                  <SelectItem value="similar">Similar (±1 grade)</SelectItem>
                  <SelectItem value="any">Any</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Clarity Match</label>
              <Select
                value={criteria.clarityMatch}
                onValueChange={(value: any) => setCriteria({...criteria, clarityMatch: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Clarity matching" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exact">Exact Match</SelectItem>
                  <SelectItem value="similar">Similar (±1 grade)</SelectItem>
                  <SelectItem value="any">Any</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Cut Match</label>
              <Select
                value={criteria.cutMatch}
                onValueChange={(value: any) => setCriteria({...criteria, cutMatch: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Cut matching" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exact">Exact Match</SelectItem>
                  <SelectItem value="similar">Similar (±1 grade)</SelectItem>
                  <SelectItem value="any">Any</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center">
            <Button 
              onClick={findMatchingSets}
              disabled={isSearching}
              className="px-8"
            >
              {isSearching ? "Searching..." : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Find Matching Sets
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {matchingSets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Matching Sets</CardTitle>
              <CardDescription>
                Found {matchingSets.length} potential matches
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[500px] overflow-y-auto">
                {matchingSets.map((set) => (
                  <div 
                    key={set.id}
                    className={`flex items-center justify-between p-4 border-b cursor-pointer hover:bg-muted/50 ${selectedSet?.id === set.id ? 'bg-muted' : ''}`}
                    onClick={() => setSelectedSet(set)}
                  >
                    <div>
                      <div className="font-medium">
                        {set.diamonds.length} {set.diamonds[0].shape} Diamonds
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {set.totalCarats.toFixed(2)}ct total • {formatCurrency(set.averagePrice)} avg
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 text-sm font-medium">
                        <span className={`${set.matchScore > 90 ? 'text-green-600' : set.matchScore > 75 ? 'text-amber-600' : 'text-red-600'}`}>
                          {set.matchScore.toFixed(0)}% match
                        </span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Set Details</CardTitle>
              {selectedSet && (
                <CardDescription>
                  {selectedSet.diamonds.length} {selectedSet.diamonds[0].shape} diamonds • {selectedSet.totalCarats.toFixed(2)}ct total
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {selectedSet ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant={selectedSet.matchScore > 90 ? "default" : selectedSet.matchScore > 75 ? "secondary" : "outline"}>
                      {selectedSet.matchScore.toFixed(0)}% Match Score
                    </Badge>
                    {selectedSet.matchScore < 80 && (
                      <Alert variant="destructive" className="p-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          This set has notable variations. Check details carefully.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Carat</TableHead>
                        <TableHead>Color</TableHead>
                        <TableHead>Clarity</TableHead>
                        <TableHead>Cut</TableHead>
                        <TableHead>Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedSet.diamonds.map((diamond) => (
                        <TableRow key={diamond.id}>
                          <TableCell className="font-medium">{diamond.sku}</TableCell>
                          <TableCell>{diamond.carat.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getColorClass(diamond.color)}>
                              {diamond.color}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getClarityClass(diamond.clarity)}>
                              {diamond.clarity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getCutClass(diamond.cut)}>
                              {diamond.cut}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatCurrency(diamond.retailPrice)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="flex justify-end">
                    <Button>Create Custom Set</Button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 text-muted-foreground">
                  {matchingSets.length === 0 ? 
                    "No matching sets found. Try adjusting your criteria." : 
                    "Select a set from the list to view details."
                  }
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              {noMatchesFound ? 
                "No matching sets found. Try adjusting your criteria for better results." : 
                "Adjust your matching criteria and click \"Find Matching Sets\" to discover diamond pairs and sets."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StoneMatchingTool;
