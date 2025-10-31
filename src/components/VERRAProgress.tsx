import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, TrendingUp, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Round = {
  id: string;
  round_number: number;
  target_amount: number;
  achieved_amount: number;
  status: "completed" | "active" | "upcoming";
  is_certified: boolean;
  start_date: string | null;
  end_date: string | null;
};

const VERRAProgress = () => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRounds();
  }, []);

  const fetchRounds = async () => {
    const { data, error } = await supabase
      .from("verra_rounds")
      .select("*")
      .order("round_number", { ascending: true });

    if (error) {
      console.error("Error fetching VERRA rounds:", error);
    } else {
      setRounds((data || []) as Round[]);
    }
    setIsLoading(false);
  };

  const activeRound = rounds.find((r) => r.status === "active");
  const progressPercentage = activeRound
    ? Math.round(
        (activeRound.achieved_amount / activeRound.target_amount) * 100
      )
    : 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-accent" />
            VERRA Certification Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-accent" />
          VERRA Certification Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Active Round Progress */}
        {activeRound && (
          <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">
                Round {activeRound.round_number} - Active
              </span>
              <Badge variant="default" className="bg-accent">
                In Progress
              </Badge>
            </div>
            <Progress value={progressPercentage} className="mb-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                ${activeRound.achieved_amount.toLocaleString()} raised
              </span>
              <span>${activeRound.target_amount.toLocaleString()} target</span>
            </div>
          </div>
        )}

        {/* Rounds Timeline Slider */}
        <div className="verra-rounds-slider">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            // autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              640: {
                slidesPerView: 1.5,
              },
              1024: {
                slidesPerView: 2.5,
              },
            }}
            className="pb-12"
          >
            {rounds.map((round) => (
              <SwiperSlide key={round.id}>
                <div className="p-4 rounded-lg border border-border bg-card h-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold">
                      Round {round.round_number}
                    </span>
                    {round.status === "completed" && round.is_certified && (
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                    )}
                    {round.status === "active" && (
                      <Clock className="w-5 h-5 text-accent" />
                    )}
                    {round.status === "upcoming" && (
                      <TrendingUp className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Target:</span>
                      <span className="font-medium">
                        ${round.target_amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Achieved:</span>
                      <span className="font-medium">
                        ${round.achieved_amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge
                        variant={
                          round.status === "completed"
                            ? "default"
                            : round.status === "active"
                            ? "secondary"
                            : "outline"
                        }
                        className={
                          round.status === "completed" ? "bg-accent" : ""
                        }
                      >
                        {round.status.charAt(0).toUpperCase() +
                          round.status.slice(1)}
                      </Badge>
                    </div>
                    {round.is_certified ? (
                      <div className="pt-2 border-t border-border flex justify-between">
                        <Badge
                          variant="outline"
                          className="text-accent border-accent"
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          VERRA Certified
                        </Badge>

                        <a href="" className="text-accent underline">
                          0.0.7163937
                        </a>
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-border">
                        <Badge
                          variant="outline"
                          className="text-secondary border-secondary"
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          VERRA Certificate Pending
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Info Section */}
        <div className="p-4 rounded-lg bg-secondary/30 text-sm text-muted-foreground">
          <p className="mb-2">
            <strong>How it works:</strong> Fractionalized carbon credit tokens
            are distributed each round. Once a round reaches its target, the
            full carbon credit is certified by VERRA, and tokens become
            tradeable.
          </p>
          <p>
            Completed rounds have been officially certified, giving your tokens
            real environmental value backed by VERRA standards.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VERRAProgress;
