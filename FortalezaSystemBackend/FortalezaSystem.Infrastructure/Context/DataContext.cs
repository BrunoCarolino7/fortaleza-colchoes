using FortalezaSystem.Domain.Entities;
using FortalezaSystem.Domain.Enuns;
using Microsoft.EntityFrameworkCore;

namespace FortalezaSystem.Infrastructure.Context;

public class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
{
    public DbSet<Clientes> Clientes { get; set; }
    public DbSet<Endereco> Enderecos { get; set; }
    public DbSet<Documento> Documentos { get; set; }
    public DbSet<DadosProfissionais> DadosProfissionais { get; set; }
    public DbSet<Conjuge> Conjuges { get; set; }
    public DbSet<Referencia> Referencias { get; set; }
    public DbSet<InformacoesPagamento> InformacoesPagamento { get; set; }
    public DbSet<Parcela> Parcelas { get; set; }
    public DbSet<Assinatura> Assinaturas { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        base.OnModelCreating(modelBuilder);

        modelBuilder.HasDefaultSchema("fortaleza");

        foreach (var property in modelBuilder.Model.GetEntityTypes()
                     .SelectMany(t => t.GetProperties())
                     .Where(p => p.ClrType == typeof(decimal)))
        {
            property.SetPrecision(18);
            property.SetScale(2);
        }

        // Cliente
        modelBuilder.Entity<Clientes>(builder =>
            {
                builder.ToTable("Clientes");
                builder.HasKey(c => c.Id);

                builder.Property(c => c.Nome).HasMaxLength(150).IsRequired();
                builder.Property(c => c.Filiacao).HasMaxLength(150);
                builder.Property(c => c.Nacionalidade).HasMaxLength(50);
                builder.Property(c => c.Naturalidade).HasMaxLength(50);
                builder.Property(c => c.EstadoCivil).HasMaxLength(30);

                builder.HasMany(c => c.Enderecos)
                       .WithOne(e => e.Cliente)
                       .HasForeignKey(e => e.ClienteId)
                       .IsRequired(false)
                       .OnDelete(DeleteBehavior.Cascade);

                builder.HasMany(c => c.Referencias)
                       .WithOne(r => r.Cliente)
                       .HasForeignKey(r => r.ClienteId)
                       .OnDelete(DeleteBehavior.Cascade);

                builder.HasOne(c => c.Documento)
                       .WithOne(d => d.Cliente)
                       .HasForeignKey<Documento>(d => d.ClienteId)
                       .IsRequired(false)
                       .OnDelete(DeleteBehavior.Cascade);

                builder.HasOne(c => c.DadosProfissionais)
                       .WithOne(dp => dp.Cliente)
                       .HasForeignKey<DadosProfissionais>(dp => dp.ClienteId)
                       .OnDelete(DeleteBehavior.Cascade);

                builder.HasOne(c => c.Conjuge)
                       .WithOne(co => co.Cliente)
                       .HasForeignKey<Conjuge>(co => co.ClienteId)
                       .OnDelete(DeleteBehavior.Cascade);

                builder.HasOne(c => c.Pagamento)
                       .WithOne(p => p.Cliente)
                       .HasForeignKey<InformacoesPagamento>(p => p.ClienteId)
                       .OnDelete(DeleteBehavior.Cascade);

                builder.HasOne(c => c.Assinatura)
                       .WithOne(a => a.Cliente)
                       .HasForeignKey<Assinatura>(a => a.ClienteId)
                       .OnDelete(DeleteBehavior.Cascade);
            });

        // Endereco
        modelBuilder.Entity<Endereco>(builder =>
        {
            builder.ToTable("Enderecos");
            builder.HasKey(e => e.Id);

            builder.Property(e => e.Logradouro).HasMaxLength(200);
            builder.Property(e => e.Bairro).HasMaxLength(100);
            builder.Property(e => e.Jardim).HasMaxLength(100);
            builder.Property(e => e.CEP).HasMaxLength(20);
            builder.Property(e => e.Localizacao).HasMaxLength(100);
            builder.Property(e => e.Cidade).HasMaxLength(100);
            builder.Property(e => e.Estado).HasMaxLength(2);
            builder.Property(e => e.ClienteId).IsRequired(false);

        });

        // Documento
        modelBuilder.Entity<Documento>(builder =>
        {
            builder.ToTable("Documentos");
            builder.HasKey(d => d.Id);

            builder.Property(d => d.RG).HasMaxLength(20);
            builder.Property(d => d.CPF).HasMaxLength(14).IsRequired();
        });

        // Dados Profissionais
        modelBuilder.Entity<DadosProfissionais>(builder =>
        {
            builder.ToTable("DadosProfissionais");
            builder.HasKey(dp => dp.Id);

            builder.Property(dp => dp.Empresa).HasMaxLength(150);
            builder.Property(dp => dp.EmpregoAnterior).HasMaxLength(150);
            builder.Property(dp => dp.Telefone).HasMaxLength(20);
            builder.Property(dp => dp.Salario).HasColumnType("decimal(18,2)");

            builder.HasOne(dp => dp.EnderecoEmpresa)
                   .WithMany()
                   .HasForeignKey(dp => dp.EnderecoEmpresaId)
                   .OnDelete(DeleteBehavior.Restrict);
        });

        // Conjuge
        modelBuilder.Entity<Conjuge>(builder =>
        {
            builder.ToTable("Conjuges");
            builder.HasKey(c => c.Id);

            builder.Property(c => c.Nome).HasMaxLength(150);
            builder.Property(c => c.Naturalidade).HasMaxLength(100);
            builder.Property(c => c.LocalDeTrabalho).HasMaxLength(150);

            builder.HasOne(c => c.Documento)
                   .WithMany()
                   .HasForeignKey(c => c.DocumentoId)
                   .OnDelete(DeleteBehavior.Restrict);
        });

        // Referencia
        modelBuilder.Entity<Referencia>(builder =>
        {
            builder.ToTable("Referencias");
            builder.HasKey(r => r.Id);

            builder.Property(r => r.Nome).HasMaxLength(150);

            builder.HasOne(r => r.Endereco)
                   .WithMany()
                   .HasForeignKey(r => r.EnderecoId)
                   .OnDelete(DeleteBehavior.Restrict);
        });

        // InformacoesPagamento
        modelBuilder.Entity<InformacoesPagamento>(builder =>
        {
            builder.ToTable("InformacoesPagamento");
            builder.HasKey(p => p.Id);

            builder.Property(p => p.ValorTotal).HasColumnType("decimal(18,2)").IsRequired();
            builder.Property(p => p.Sinal).HasColumnType("decimal(18,2)").IsRequired();
            builder.Property(p => p.DataInicio).IsRequired();
            builder.Property(p => p.NumeroParcelas).IsRequired();

            builder.HasMany(p => p.Parcelas)
                   .WithOne(pa => pa.InformacoesPagamento)
                   .HasForeignKey(pa => pa.InformacoesPagamentoId)
                   .OnDelete(DeleteBehavior.Cascade);
        });

        // Parcela
        modelBuilder.Entity<Parcela>(builder =>
        {
            builder.ToTable("Parcelas");
            builder.HasKey(p => p.Id);

            builder.Property(p => p.Numero).IsRequired();
            builder.Property(p => p.Valor).HasColumnType("decimal(18,2)").IsRequired();
            builder.Property(p => p.Vencimento).IsRequired();

            builder.Property(p => p.StatusPagamento)
                   .HasConversion<int>()
                   .IsRequired()
                   .HasDefaultValue(EStatusPagamento.Pendente);
        });

        // Assinatura
        modelBuilder.Entity<Assinatura>(builder =>
        {
            builder.ToTable("Assinaturas");
            builder.HasKey(a => a.Id);

            builder.Property(a => a.AssinaturaCliente).HasMaxLength(200);
        });
    }
}